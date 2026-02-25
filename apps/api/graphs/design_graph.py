from langgraph.graph import StateGraph, END
from agents.state import DesignState
from agents.supervisor import supervisor_node, quality_checker_node
from agents.design_architect import design_architect_node

def route_intent(state: DesignState) -> str:
    if state.get("intent") == "generate":
        return "design_architect"
    elif state.get("intent") == "edit":
        # We don't have an edit node yet, so go to end for now
        return END
    return END

def should_continue(state: DesignState) -> str:
    if state.get("iteration", 0) >= 1:
        return END
    return "design_architect"

# 1. Initialize the graph
workflow = StateGraph(DesignState)

# 2. Add nodes
workflow.add_node("supervisor", supervisor_node)
workflow.add_node("design_architect", design_architect_node)
workflow.add_node("quality_checker", quality_checker_node)

# 3. Add edges
workflow.set_entry_point("supervisor")

# Route based on intent
workflow.add_conditional_edges(
    "supervisor",
    route_intent,
    {
        "design_architect": "design_architect",
        END: END
    }
)

# Architect goes to Quality Checker
workflow.add_edge("design_architect", "quality_checker")

# Quality checker loops back or ends
workflow.add_conditional_edges(
    "quality_checker",
    should_continue,
    {
        "design_architect": "design_architect",
        END: END
    }
)

# Compile graph
design_graph = workflow.compile()
