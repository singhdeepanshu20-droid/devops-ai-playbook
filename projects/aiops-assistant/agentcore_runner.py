"""
AIOps Assistant — AgentCore / Custom Bedrock Agent Runner
Orchestrates the Bedrock model tool-use loop with AWS Lambda action tools.
"""

import json
import os
import boto3
from typing import Dict, Any, List

REGION = os.getenv("AWS_REGION", "ap-southeast-2")
MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "qwen.qwen3-32b-v1:0")

SYSTEM_INSTRUCTION = (
    "You are IRON MAN, a senior Site Reliability Engineer with 12 years of experience managing large-scale production systems on AWS. "
    "You have deep expertise in distributed systems, database performance tuning, container orchestration, and incident response.\n\n"
    "You think like a real SRE during an incident — calm, methodical, and data-driven. You never guess. You always look at the data first before drawing conclusions.\n\n"
    "You have 3 tools: fetch_logs (CloudWatch Logs), fetch_metrics (CloudWatch Metrics), and fetch_service_health (EKS cluster, node group, and pod health).\n\n"
    "When an engineer comes with a problem:\n"
    "Step 1: Understand the symptom.\n"
    "Step 2: Form a hypothesis.\n"
    "Step 3: Gather evidence using your tools.\n"
    "Step 4: Diagnose by correlating the data across logs, metrics, and service health.\n"
    "Step 5: Respond with root cause, evidence summary, immediate fix, and prevention steps.\n\n"
    "Always cite specific log entries or metric values when drawing conclusions. Be concise but thorough."
)

TOOL_CONFIG = {
    "tools": [
        {
            "toolSpec": {
                "name": "fetch_logs",
                "description": "Search CloudWatch Logs for errors, warnings, and application events",
                "inputSchema": {
                    "json": {
                        "type": "object",
                        "properties": {
                            "log_group": {"type": "string", "description": "CloudWatch log group name"},
                            "query": {"type": "string", "description": "Search query or error term"},
                            "minutes": {"type": "integer", "description": "Minutes back to query (default 60)"}
                        }
                    }
                }
            }
        },
        {
            "toolSpec": {
                "name": "fetch_metrics",
                "description": "Retrieve CloudWatch performance metrics (CPU, memory, latency, error rates)",
                "inputSchema": {
                    "json": {
                        "type": "object",
                        "properties": {
                            "service": {"type": "string", "description": "Service name to fetch metrics for"},
                            "metric": {"type": "string", "description": "Metric name e.g. cpu, memory, latency"},
                            "minutes": {"type": "integer", "description": "Minutes back to query"}
                        }
                    }
                }
            }
        },
        {
            "toolSpec": {
                "name": "fetch_service_health",
                "description": "Check live health status of EKS cluster, node groups, and crashing pods",
                "inputSchema": {
                    "json": {
                        "type": "object",
                        "properties": {
                            "cluster_name": {"type": "string", "description": "EKS cluster name"}
                        }
                    }
                }
            }
        }
    ]
}

LAMBDA_MAPPING = {
    "fetch_logs": "aiops-fetch-logs",
    "fetch_metrics": "aiops-fetch-metrics",
    "fetch_service_health": "aiops-fetch-health"
}

def invoke_lambda_tool(tool_name: str, tool_args: Dict[str, Any]) -> str:
    """Executes the AWS Lambda function associated with a tool name."""
    lambda_client = boto3.client("lambda", region_name=REGION)
    func_name = LAMBDA_MAPPING.get(tool_name)
    if not func_name:
        return json.dumps({"error": f"Unknown tool {tool_name}"})
    
    try:
        response = lambda_client.invoke(
            FunctionName=func_name,
            InvocationType="RequestResponse",
            Payload=json.dumps(tool_args)
        )
        payload = response["Payload"].read().decode("utf-8")
        return payload
    except Exception as e:
        return json.dumps({"error": str(e)})

def run_agent_loop(user_prompt: str, conversation_history: List[Dict[str, Any]] = None) -> str:
    """Executes the agent core converse loop until final text response."""
    bedrock_runtime = boto3.client("bedrock-runtime", region_name=REGION)

    messages = conversation_history or []
    messages.append({
        "role": "user",
        "content": [{"text": user_prompt}]
    })

    system_prompts = [{"text": SYSTEM_INSTRUCTION}]

    max_turns = 10
    turn = 0

    while turn < max_turns:
        turn += 1
        try:
            response = bedrock_runtime.converse(
                modelId=MODEL_ID,
                messages=messages,
                system=system_prompts,
                toolConfig=TOOL_CONFIG
            )

            output_message = response["output"]["message"]
            messages.append(output_message)

            stop_reason = response.get("stopReason")
            if stop_reason == "tool_use":
                tool_results = []
                for content_block in output_message["content"]:
                    if "toolUse" in content_block:
                        tool_use = content_block["toolUse"]
                        tool_id = tool_use["toolUseId"]
                        tool_name = tool_use["name"]
                        tool_input = tool_use.get("input", {})

                        # Invoke Lambda
                        tool_output_str = invoke_lambda_tool(tool_name, tool_input)

                        tool_results.append({
                            "toolResult": {
                                "toolUseId": tool_id,
                                "content": [{"json": json.loads(tool_output_str) if tool_output_str.startswith("{") else {"output": tool_output_str}}]
                            }
                        })

                # Append tool results as user message
                messages.append({
                    "role": "user",
                    "content": tool_results
                })
            else:
                # Final response generated
                text_response = ""
                for content_block in output_message["content"]:
                    if "text" in content_block:
                        text_response += content_block["text"]
                return text_response

        except Exception as e:
            return f"⚠️ AgentCore Execution Error: {str(e)}"

    return "⚠️ Agent execution exceeded maximum tool turns."
