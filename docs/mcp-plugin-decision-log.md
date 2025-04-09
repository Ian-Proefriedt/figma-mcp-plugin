# MCP Plugin - Decision Log

## Document Purpose
This document tracks key decisions made during the MCP plugin development, including:
- What decisions were made
- Why they were made
- What alternatives were considered
- What impact they had

## Property Block Refactor Decisions

### 2024-03-21: Complete Removal Approach
**Decision**: Remove all old property block code and start fresh
**Rationale**:
- Current implementation has tangled code with property blocks
- Multiple event listeners and state management issues
- Difficult to maintain and extend
- Clean slate allows for better architecture

**Alternatives Considered**:
- Incremental refactor of existing code
- Partial removal with gradual replacement
- Keeping some existing functionality

**Impact**:
- Requires careful preservation of data detection logic
- Need to maintain visual consistency
- Must ensure no disruption to Cursor communication

### 2024-03-21: Implementation Order
**Decision**: Start with single number inputs, then dropdowns, then multi-input blocks
**Rationale**:
- Single number inputs are simplest to implement
- Allows testing core functionality first
- Builds complexity gradually
- Easier to debug and verify

**Alternatives Considered**:
- Start with multi-input blocks
- Implement all types simultaneously
- Start with dropdowns

**Impact**:
- Clear progression path
- Can validate approach with simpler cases
- Reduces risk of complex bugs early on

### 2024-03-21: Data Storage Approach
**Decision**: Store values in dataset.originalContent with type-specific formats
**Rationale**:
- Maintains consistency with existing code
- Preserves original values for comparison
- Simplifies state management
- Enables easy reset functionality

**Alternatives Considered**:
- Separate state management system
- In-memory storage only
- Complex data structures

**Impact**:
- Clear data flow
- Easy to debug
- Maintains existing functionality

## Plugin Architecture Decisions
[Decisions about overall plugin architecture will be documented here]

## UI/UX Decisions
[Decisions about user interface and experience will be documented here]

## Integration Decisions
[Decisions about Figma and Cursor integration will be documented here]

## Open Questions
- Specific validation rules for each property type
- Error handling requirements
- Testing success criteria
- Button visibility and activation rules
- Layer tree view implementation details
- [Other open questions will be added here]

## Next Steps
- Document validation rules as they are defined
- Track error handling decisions
- Record testing approach decisions
- Implement button state management
- Define layer tree view requirements
- [Other next steps will be added here] 