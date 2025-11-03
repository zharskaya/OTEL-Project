# Feature Specification: Telemetry Transformation UI Demo

**Feature Branch**: `001-telemetry-transform-ui`  
**Created**: November 1, 2025  
**Updated**: November 1, 2025 (Added hardcoded telemetry sample data; simplified Copy/Download to demo placeholders)  
**Status**: Draft  
**Input**: User description: "Demo project for a Collector tool that allows users to transform telemetry (transform processor) before sending to storage/Observability tool. Main focus is on UX of the transformation itself. Uses hardcoded telemetry sample for demo version. Copy and Download actions show 'Not included in this demo' message."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Transform Telemetry Sample Data (Priority: P1)

A user needs to see telemetry data in a readable format and apply basic transformations like adding, removing, or masking attributes without writing code.

**Why this priority**: Core value proposition - users can transform telemetry visually without OTTL knowledge. This is the foundation that all other stories build upon.

**Independent Test**: Can be fully tested by loading sample telemetry data, applying a single transformation (add/remove/mask), and verifying the preview shows expected changes. Delivers immediate value by demonstrating the visual transformation concept.

**Acceptance Scenarios**:

1. **Given** the application loads, **When** user views the INPUT panel, **Then** they see a hierarchical tree view of telemetry data with Resource, Span Info, and Span Attributes sections expanded by default, and Scope Info, Events, and Links sections collapsed
2. **Given** telemetry data is displayed, **When** user hovers over any attribute value, **Then** they see a tooltip indicating "Select to modify"
3. **Given** telemetry data is displayed, **When** user clicks the Run button or presses ⌘+Enter (Ctrl+Enter on Windows), **Then** the transformation executes and results appear in the OUTPUT panel
4. **Given** no transformations have been run, **When** user views the OUTPUT panel, **Then** they see a hint message prompting them to run transformations
5. **Given** transformations have been applied, **When** results are displayed in OUTPUT panel, **Then** the data is read-only and formatted identically to the INPUT panel structure

---

### User Story 2 - Add Static Attributes (Priority: P1)

A user wants to add new attributes with static values to their telemetry data without writing transformation code.

**Why this priority**: One of the most common transformation needs. Essential for the basic transformation workflow and demonstrates the visual approach.

**Independent Test**: Can be tested by clicking the "Add" button, entering a key-value pair, saving it, and verifying it appears in the OUTPUT preview with "ADD" label and green highlighting.

**Acceptance Scenarios**:

1. **Given** user is viewing a telemetry section, **When** they click the "Add" icon button at the section header, **Then** a new editable row appears at the top of the attribute list with placeholder text "Enter new_key = new_value" and cursor focused in the text field
2. **Given** the add row is active, **When** user types a valid key-value pair and presses Enter or clicks Save, **Then** the text field converts to plain text showing the key and value, an "ADD" label appears in green, and a drag handle icon appears on the left
3. **Given** the add row is active, **When** user presses ESC or clicks Cancel, **Then** the row is removed without saving changes
4. **Given** the add row is active with empty text, **When** user clicks outside the text field, **Then** the row is removed (cancel behavior)
5. **Given** the add row is active with text entered, **When** user clicks outside the text field, **Then** the changes are saved (save behavior)
6. **Given** a new attribute has been added, **When** transformations are run, **Then** the OUTPUT panel shows the new attribute in the appropriate section

---

### User Story 3 - Remove Existing Attributes (Priority: P1)

A user needs to exclude specific attributes from their telemetry data before sending to storage.

**Why this priority**: Another fundamental transformation type. Together with adding attributes, this covers the most common transformation needs.

**Independent Test**: Can be tested by hovering over an existing attribute, clicking Delete, and verifying the OUTPUT preview excludes that attribute with appropriate strikethrough and "DELETE" labeling.

**Acceptance Scenarios**:

1. **Given** user hovers over an unmodified attribute row, **When** the row is highlighted, **Then** a "Delete" button appears on the right side
2. **Given** a Delete button is visible, **When** user clicks it, **Then** the key and value become dimmed and crossed out, a "DELETE" label appears in red, a drag handle appears on the left, and the background becomes light red
3. **Given** an attribute has been marked for deletion, **When** user hovers over it, **Then** an "Undo" button appears instead of "Delete"
4. **Given** an attribute is marked for deletion, **When** user clicks Undo, **Then** the attribute returns to its original unmodified state
5. **Given** attributes are marked for deletion, **When** transformations are run, **Then** the OUTPUT panel does not display the deleted attributes

---

### User Story 4 - Mask Sensitive Data (Priority: P2)

A user needs to partially or fully mask sensitive values (like PII or secrets) in attribute values before sending telemetry to observability tools.

**Why this priority**: Critical for security and compliance but slightly lower priority than basic add/remove operations. Many users will need this capability.

**Independent Test**: Can be tested by selecting part of an attribute value, choosing MASK option, and verifying the OUTPUT shows the masked portion replaced with asterisks.

**Acceptance Scenarios**:

1. **Given** user hovers over an attribute value, **When** they select the full value or a substring, **Then** a tooltip shows the selection type (Full string, Substr(0,5), Substr(5,end)) and displays MASK and NEW ATRBT options
2. **Given** user has selected a value or substring, **When** they click MASK option, **Then** a new value appears above showing the masked portion as asterisks, the old value appears below dimmed and crossed out, a "MASK [range]" label appears in blue, a drag handle appears, and the background becomes light blue
3. **Given** a value has been masked, **When** user hovers over the row, **Then** an "Undo" button appears
4. **Given** a masked value exists, **When** user clicks Undo, **Then** the masking is removed and the value returns to original state
5. **Given** attributes have been masked, **When** transformations are run, **Then** the OUTPUT panel shows values with masked portions replaced by asterisks

---

### User Story 5 - Create Attributes from Substrings (Priority: P2)

A user wants to extract part of an existing attribute value and create a new attribute from it, such as extracting a region code from a full resource name.

**Why this priority**: Enables data enrichment scenarios. Important for advanced users but not essential for basic transformation workflows.

**Independent Test**: Can be tested by selecting a substring of an attribute value, choosing NEW ATRBT, naming the new attribute, and verifying OUTPUT shows both original and new attributes.

**Acceptance Scenarios**:

1. **Given** user has selected a value or substring, **When** they click NEW ATRBT option, **Then** a new row appears above with the value shown as "SUBSTR(attribute_key, range)", the key field becomes editable with cursor focused and placeholder "Enter new_key"
2. **Given** the new attribute row is active, **When** user types a key name and presses Enter or clicks Save, **Then** the row converts to plain text, an "ADD" label appears in green, a drag handle appears, and the background becomes light green
3. **Given** the new attribute row is active, **When** user presses ESC or clicks Cancel without entering text, **Then** the row is removed
4. **Given** the new attribute row is active with empty key field, **When** user clicks outside the text field, **Then** the row is removed (cancel behavior)
5. **Given** the new attribute row is active with a key entered, **When** user clicks outside the text field, **Then** the changes are saved (save behavior)
6. **Given** substring-based attributes have been added, **When** transformations are run, **Then** the OUTPUT panel shows the new attributes with extracted values

---

### User Story 6 - Rename Attribute Keys (Priority: P2)

A user needs to change attribute key names to match their organization's naming conventions or standardize telemetry data.

**Why this priority**: Important for data standardization but less urgent than adding/removing attributes. Supports advanced transformation scenarios.

**Independent Test**: Can be tested by clicking an attribute key, entering a new name, and verifying OUTPUT shows the renamed key with the same value.

**Acceptance Scenarios**:

1. **Given** user hovers over an attribute key, **When** the row is highlighted, **Then** a tooltip shows "Click to rename"
2. **Given** user clicks on an attribute key, **When** the key becomes editable, **Then** the existing text is selected, Save and Cancel buttons appear, and the cursor is focused
3. **Given** the key field is active, **When** user types a new name and presses Enter or clicks Save, **Then** the field returns to plain text, the new key appears above the old key (which is dimmed and crossed out), a "RENAME KEY" label appears in blue, a drag handle appears, and the background becomes light blue
4. **Given** the key field is active, **When** user presses ESC or clicks Cancel, **Then** the key returns to its original state
5. **Given** the key field is active with no changes, **When** user clicks outside, **Then** the edit is cancelled
6. **Given** the key field is active with changes, **When** user clicks outside, **Then** the changes are saved
7. **Given** keys have been renamed, **When** transformations are run, **Then** the OUTPUT panel shows the new key names with their associated values

---

### User Story 7 - Apply Raw OTTL Statements (Priority: P3)

An advanced user needs to apply transformations that aren't supported by the visual interface, so they can write raw OTTL statements directly.

**Why this priority**: Supports advanced users and edge cases but not core to the visual transformation UX. Most users should accomplish tasks through the visual interface.

**Independent Test**: Can be tested by clicking the "Terminal" button, entering a valid OTTL statement, and verifying OUTPUT reflects the OTTL transformation.

**Acceptance Scenarios**:

1. **Given** user is viewing a telemetry section, **When** they click the "Terminal" icon button at the section header, **Then** a new row appears with terminal icon, an editable text field with placeholder "Add raw OTTL statement", and cursor focused
2. **Given** the OTTL row is active, **When** user types an OTTL statement and presses Enter or clicks Save, **Then** the text field converts to code-formatted plain text, an "ADD" label appears in green, a drag handle appears, and the background becomes light green
3. **Given** the OTTL row is active, **When** user presses ESC or clicks Cancel, **Then** the row is removed
4. **Given** the OTTL row is active with empty field, **When** user clicks outside, **Then** the row is removed (cancel behavior)
5. **Given** the OTTL row is active with text entered, **When** user clicks outside, **Then** the changes are saved (save behavior)
6. **Given** raw OTTL statements exist, **When** transformations are run, **Then** the OUTPUT panel reflects the OTTL transformations

---

### User Story 8 - Reorder Transformations (Priority: P2)

A user needs to change the order of transformations because they are applied sequentially and order matters for the final result.

**Why this priority**: Essential for complex transformation workflows but only needed after users have created multiple transformations. Lower priority than basic transformation creation.

**Independent Test**: Can be tested by creating two transformations, dragging one above/below the other, running the preview, and verifying the order affects the output.

**Acceptance Scenarios**:

1. **Given** a transformation row has been created (ADD, DELETE, MASK, RENAME KEY, or raw OTTL), **When** user views the row, **Then** a drag handle icon is visible on the left side
2. **Given** user clicks and holds the drag handle, **When** they drag the row, **Then** the row follows the cursor and available drop positions are highlighted
3. **Given** user is dragging an ADD or raw OTTL transformation, **When** they move it over the telemetry tree, **Then** drop positions are highlighted anywhere in the data structure
4. **Given** user is dragging a modification transformation (MASK, DELETE, RENAME KEY), **When** they move it, **Then** drop positions are only highlighted within the same section (Resource, Span Info, Span Attributes, etc.)
5. **Given** user has dragged a transformation to a new position, **When** they release, **Then** the transformation moves to the new position in the sequence
6. **Given** transformations have been reordered, **When** user runs the preview, **Then** transformations are applied in the new order from top to bottom

---

### User Story 9 - Navigate with Keyboard (Priority: P2)

A power user wants to perform all transformation operations using keyboard shortcuts for efficiency.

**Why this priority**: Enhances productivity for frequent users but not essential for basic functionality. Improves accessibility.

**Independent Test**: Can be tested by performing a complete transformation workflow using only keyboard (Tab, Enter, arrow keys, shortcuts) without touching the mouse.

**Acceptance Scenarios**:

1. **Given** user presses Tab key, **When** navigating the interface, **Then** focus moves sequentially through interactive elements (rows, buttons, fields)
2. **Given** user focuses on a row, **When** they press Enter, **Then** the row enters edit mode
3. **Given** user is in edit mode, **When** they press ESC, **Then** the edit is cancelled and focus returns to the row
4. **Given** user is navigating rows, **When** they press ↑/↓ arrow keys, **Then** focus moves between rows
5. **Given** user is in a multi-column context, **When** they press ←/→ arrow keys, **Then** focus moves between columns
6. **Given** user has a row focused, **When** they press ⌘↑ or Ctrl↑ (or ⌘[), **Then** the row moves up in the sequence
7. **Given** user has a row focused, **When** they press ⌘↓ or Ctrl↓ (or ⌘]), **Then** the row moves down in the sequence
8. **Given** user has made transformations, **When** they press ⌘+Enter (Ctrl+Enter on Windows), **Then** the transformations execute and OUTPUT updates
9. **Given** keyboard shortcuts are available, **When** user views the interface, **Then** a keyboard hints bar is visible at the bottom of the window

---

### User Story 10 - Adjust Panel Sizes (Priority: P3)

A user wants to resize the INPUT and OUTPUT panels to focus on either the transformation interface or the results.

**Why this priority**: Nice to have for user comfort but not critical to core functionality. Provides flexibility in viewing experience.

**Independent Test**: Can be tested by dragging the divider between panels and verifying both panels resize proportionally while maintaining content readability.

**Acceptance Scenarios**:

1. **Given** the window displays INPUT and OUTPUT panels side by side, **When** user hovers over the vertical divider between them, **Then** the divider highlights and cursor changes to a horizontal resize icon
2. **Given** user clicks and holds the divider, **When** they drag left or right, **Then** the INPUT and OUTPUT panels resize proportionally
3. **Given** panels have been resized, **When** user releases the divider, **Then** the new panel sizes are maintained
4. **Given** panels are being resized, **When** user drags the divider, **Then** content within panels reflows appropriately

---

### User Story 11 - Track Changes Per Section (Priority: P3)

A user working with complex telemetry wants to see at a glance how many modifications they've made in each section (Resource, Span Info, Span Attributes, etc.).

**Why this priority**: Quality of life improvement for complex scenarios but not essential for basic use. Helps with change awareness.

**Independent Test**: Can be tested by adding transformations to different sections and verifying each section header shows an accurate count of modifications.

**Acceptance Scenarios**:

1. **Given** user has made no modifications in a section, **When** they view the section header, **Then** no update counter is displayed
2. **Given** user adds, deletes, masks, or renames an attribute in a section, **When** they view the section header, **Then** an update counter appears showing "1 UPDATE"
3. **Given** user makes multiple modifications in a section, **When** they view the section header, **Then** the counter shows the correct plural form (e.g., "2 UPDATES", "5 UPDATES")
4. **Given** user undoes modifications, **When** the modification count in a section reaches zero, **Then** the counter disappears from the section header

---

### User Story 12 - Copy and Download Results (Priority: P3)

A user wants to understand what export options are available for the transformed telemetry data.

**Why this priority**: Utility feature for awareness but not implemented in this demo version. Included to show potential future capabilities.

**Independent Test**: Can be tested by clicking the Copy or Download buttons and verifying the "Not included in this demo" message appears.

**Acceptance Scenarios**:

1. **Given** transformation results are displayed in OUTPUT panel, **When** user clicks the Copy button, **Then** a message appears saying "Not included in this demo"
2. **Given** transformation results are displayed in OUTPUT panel, **When** user clicks the Download button, **Then** a message appears saying "Not included in this demo"

---

### User Story 13 - View Change Indicators (Priority: P1)

A user needs clear visual feedback about what changes will be applied when they run transformations, including the ability to see partially transformed state.

**Why this priority**: Critical for user confidence and understanding. Without clear indicators, users can't tell what transformations will be applied.

**Independent Test**: Can be tested by making any modification and verifying appropriate color coding, labels, and visual indicators appear to distinguish the change type.

**Acceptance Scenarios**:

1. **Given** user has created an ADD transformation, **When** they view the affected row, **Then** it shows green background (when not hovered), green "ADD" label, and a drag handle icon
2. **Given** user has created a DELETE transformation, **When** they view the affected row, **Then** it shows red background, red "DELETE" label, dimmed and crossed-out text, and a drag handle icon
3. **Given** user has created a MASK transformation, **When** they view the affected row, **Then** it shows blue background, blue "MASK [range]" label, both old (crossed-out) and new (masked) values, and a drag handle icon
4. **Given** user has created a RENAME KEY transformation, **When** they view the affected row, **Then** it shows blue background, blue "RENAME KEY" label, both old (crossed-out) and new key names, and a drag handle icon
5. **Given** user has made changes, **When** they hover over a modified row, **Then** the row highlights and an "Undo" button appears on the right
6. **Given** user has made changes but not yet run transformations, **When** they view the OUTPUT panel, **Then** it displays a message "You've made changes. Run transformation (⌘ / Ctrl + Enter) to see the latest updates" and the previous output becomes dimmed
7. **Given** all code-like content is displayed (values, OTTL statements), **When** user views them, **Then** syntax highlighting is applied (strings, numbers, labels, functions have different colors)

---

### Edge Cases

- What happens when a user tries to add an attribute with a key that already exists?
- How does the system handle invalid key-value pair formats in the ADD flow (e.g., missing "=" separator)?
- What happens when a user tries to mask a substring that extends beyond the actual value length?
- How does the system handle invalid OTTL syntax when a user saves a raw OTTL statement?
- What happens if a user creates multiple transformations that conflict (e.g., DELETE then ADD the same key)?
- How does the system behave when very long attribute values (1000+ characters) are displayed?
- What happens when a user tries to drag a transformation to an invalid location?
- How does the keyboard navigation work when the telemetry tree has deeply nested sections (5+ levels)?
- What happens if the transformation execution takes longer than expected (performance edge case)?
- How does the system handle copying very large output datasets to clipboard?

## Requirements *(mandatory)*

### Functional Requirements

#### Core Data Display
- **FR-001**: System MUST use a hardcoded telemetry sample for this demo version (sample data structure defined in Sample Data section)
- **FR-002**: System MUST display telemetry sample data in a hierarchical tree structure with distinct levels for Resource, Span Info, Span Attributes, Scope Info, Events, and Links
- **FR-003**: System MUST display Resource, Span Info, and Span Attributes sections in expanded state by default
- **FR-004**: System MUST display Scope Info, Events, and Links sections in collapsed state by default
- **FR-005**: System MUST allow users to expand and collapse any section of the tree structure
- **FR-006**: System MUST display attribute data as key-value pairs with keys aligned according to tree depth and values left-aligned
- **FR-007**: System MUST apply syntax highlighting to all code-like content (strings, numbers, labels, functions) using distinct colors

#### Panel Management
- **FR-008**: System MUST display two vertical panels labeled INPUT (left) and OUTPUT (right)
- **FR-009**: System MUST allow users to resize panels by dragging the vertical divider between them
- **FR-010**: System MUST provide visual feedback (divider highlight and cursor change) when user hovers over the panel divider
- **FR-011**: System MUST maintain the INPUT panel's header with title "INPUT" and a "Run" button
- **FR-012**: System MUST maintain the OUTPUT panel's header with title "OUTPUT" and "Copy" and "Download" buttons
- **FR-013**: System MUST display a tooltip "Run (⌘ / Ctrl + Enter) to preview transformed data" when user hovers over the Run button

#### Transformation Execution
- **FR-014**: System MUST execute all transformations sequentially from first to last when user clicks Run button or presses ⌘+Enter (Ctrl+Enter on Windows)
- **FR-015**: System MUST display transformed results in the OUTPUT panel after execution
- **FR-016**: System MUST display read-only data in the OUTPUT panel (no editing or interaction)
- **FR-017**: System MUST display a prompt message "Run transformation (⌘ / Ctrl + Enter) to preview transformed data" in the OUTPUT panel when no transformations have been executed
- **FR-018**: System MUST dim the OUTPUT panel content and display "You've made changes. Run transformation (⌘ / Ctrl + Enter) to see the latest updates" when user modifies transformations after the last execution

#### Add Static Attributes
- **FR-019**: System MUST display "Add" and "Terminal" icon buttons on the right side of each top-level section header
- **FR-020**: System MUST display tooltips "Add static attribute" and "Add raw OTTL statement" for Add and Terminal buttons respectively
- **FR-021**: System MUST insert an editable row at the top of the attribute list when user clicks Add button
- **FR-022**: System MUST display placeholder text "Enter new_key = new_value" in the add row text field
- **FR-023**: System MUST focus cursor in the text field immediately when add row appears
- **FR-024**: System MUST display Save and Cancel buttons at the end of the add row
- **FR-025**: System MUST save the transformation when user presses Enter, clicks Save, or clicks outside with text entered
- **FR-026**: System MUST cancel the transformation when user presses ESC, clicks Cancel, or clicks outside with empty field
- **FR-027**: System MUST parse the entered text into separate key and value components
- **FR-028**: System MUST display the saved addition as plain text with green "ADD" label on the right
- **FR-029**: System MUST display a drag handle icon on the left side of added rows
- **FR-030**: System MUST apply light green background to added rows when not hovered or selected

#### Remove Attributes
- **FR-031**: System MUST display a "Delete" button on the right side when user hovers over unmodified attribute rows
- **FR-032**: System MUST mark the attribute for deletion when user clicks Delete button
- **FR-033**: System MUST display deleted attributes with dimmed and struck-through text (~~key~~ ~~value~~)
- **FR-034**: System MUST display a red "DELETE" label on the right side of deleted rows
- **FR-035**: System MUST display a drag handle icon on the left side of deleted rows
- **FR-036**: System MUST apply light red background to deleted rows when not hovered or selected
- **FR-037**: System MUST exclude deleted attributes from the OUTPUT panel after transformation execution

#### Mask Values
- **FR-038**: System MUST display a tooltip "Select to modify" when user hovers over any attribute value
- **FR-039**: System MUST allow users to select full values or substrings of attribute values
- **FR-040**: System MUST display a tooltip showing the selection type (Full string, Substr(0,N), Substr(N,end)) and MASK/NEW ATRBT options when text is selected
- **FR-041**: System MUST create a masking transformation when user selects MASK option
- **FR-042**: System MUST display masked values with the selected portion replaced by asterisks (*****) above the original value
- **FR-043**: System MUST display the original value below as dimmed and struck-through
- **FR-044**: System MUST display a blue "MASK [range]" label on the right side showing the masked range
- **FR-045**: System MUST display a drag handle icon on the left side of masked rows
- **FR-046**: System MUST apply light blue background to masked rows when not hovered or selected
- **FR-047**: System MUST apply masking to the appropriate substring ranges in the OUTPUT panel after execution

#### Create Attributes from Substrings
- **FR-048**: System MUST create a new attribute row above the selected attribute when user chooses NEW ATRBT option
- **FR-049**: System MUST display the value as a function notation "SUBSTR(attribute_key, start-end)" in the new row
- **FR-050**: System MUST make the key field immediately editable with cursor focused and placeholder "Enter new_key"
- **FR-051**: System MUST display Save and Cancel buttons for the new attribute row
- **FR-052**: System MUST save the new attribute when user presses Enter, clicks Save, or clicks outside with text entered
- **FR-053**: System MUST cancel the new attribute when user presses ESC, clicks Cancel, or clicks outside with empty field
- **FR-054**: System MUST display the saved new attribute as plain text with green "ADD" label
- **FR-055**: System MUST display a drag handle icon on the left side of the new attribute row
- **FR-056**: System MUST apply light green background to new attribute rows when not hovered or selected
- **FR-057**: System MUST extract the specified substring and create the new attribute in the OUTPUT panel after execution

#### Rename Keys
- **FR-058**: System MUST display a tooltip "Click to rename" when user hovers over any attribute key
- **FR-059**: System MUST make the key field editable when user clicks on it
- **FR-060**: System MUST select the existing key text and focus cursor when entering edit mode
- **FR-061**: System MUST display Save and Cancel buttons next to the editable key field
- **FR-062**: System MUST save the rename when user presses Enter, clicks Save, or clicks outside with changed text
- **FR-063**: System MUST cancel the rename when user presses ESC, clicks Cancel, or clicks outside with unchanged text
- **FR-064**: System MUST display the new key above the old key (which is dimmed and struck-through) after saving
- **FR-065**: System MUST display a blue "RENAME KEY" label on the right side of renamed rows
- **FR-066**: System MUST display a drag handle icon on the left side of renamed rows
- **FR-067**: System MUST apply light blue background to renamed rows when not hovered or selected
- **FR-068**: System MUST use the new key name in the OUTPUT panel after execution

#### Raw OTTL Statements
- **FR-069**: System MUST insert an editable row when user clicks the Terminal button
- **FR-070**: System MUST display a terminal icon, text field, and Save/Cancel buttons in the OTTL row
- **FR-071**: System MUST focus cursor in the text field with placeholder "Add raw OTTL statement"
- **FR-072**: System MUST save the OTTL statement when user presses Enter, clicks Save, or clicks outside with text entered
- **FR-073**: System MUST cancel the OTTL statement when user presses ESC, clicks Cancel, or clicks outside with empty field
- **FR-074**: System MUST display the saved OTTL statement as code-formatted plain text
- **FR-075**: System MUST display a green "ADD" label on the right side of OTTL rows
- **FR-076**: System MUST display a drag handle icon on the left side of OTTL rows
- **FR-077**: System MUST apply light green background to OTTL rows when not hovered or selected
- **FR-078**: System MUST execute the raw OTTL statement during transformation execution

#### Undo Operations
- **FR-079**: System MUST display an "Undo" button instead of "Delete" when user hovers over modified rows (ADD, DELETE, MASK, RENAME KEY, raw OTTL)
- **FR-080**: System MUST remove the transformation and restore original state when user clicks Undo
- **FR-081**: System MUST update the OUTPUT panel appropriately when transformations are undone and re-executed

#### Reordering Transformations
- **FR-082**: System MUST allow users to drag and drop transformation rows using the drag handle icon
- **FR-083**: System MUST highlight available drop positions when user drags a transformation row
- **FR-084**: System MUST allow ADD and raw OTTL transformations to be placed anywhere in the data structure
- **FR-085**: System MUST restrict MASK, DELETE, and RENAME KEY transformations to be reordered only within their original section (Resource, Span Info, Span Attributes, etc.)
- **FR-086**: System MUST move the transformation to the new position when user drops it at a highlighted location
- **FR-087**: System MUST apply transformations in the displayed order (top to bottom) during execution

#### Change Tracking
- **FR-088**: System MUST display an update counter on section headers (Resource, Span Info, etc.) when modifications exist within that section
- **FR-089**: System MUST show "1 UPDATE" for a single modification and "N UPDATES" for multiple modifications
- **FR-090**: System MUST hide the update counter when all modifications in a section are undone
- **FR-091**: System MUST update the counter in real-time as transformations are added, removed, or undone

#### Keyboard Navigation
- **FR-092**: System MUST support Tab key to navigate sequentially through interactive elements
- **FR-093**: System MUST support Enter key to activate edit mode on focused rows
- **FR-094**: System MUST support ESC key to cancel edit mode and return focus
- **FR-095**: System MUST support ↑/↓ arrow keys to navigate between rows
- **FR-096**: System MUST support ←/→ arrow keys to navigate between columns
- **FR-097**: System MUST support ⌘↑/Ctrl↑ or ⌘[ to move focused row upward in sequence
- **FR-098**: System MUST support ⌘↓/Ctrl↓ or ⌘] to move focused row downward in sequence
- **FR-099**: System MUST support ⌘+Enter (Ctrl+Enter on Windows) to execute transformations from anywhere in the interface
- **FR-100**: System MUST display a keyboard hints bar at the bottom of the window showing available shortcuts

#### Copy and Download
- **FR-101**: System MUST display a "Not included in this demo" message when user clicks Copy button
- **FR-102**: System MUST display a "Not included in this demo" message when user clicks Download button

#### Visual Feedback
- **FR-103**: System MUST highlight rows on hover
- **FR-104**: System MUST use consistent color coding: green for ADD operations, red for DELETE operations, blue for MASK and RENAME KEY operations
- **FR-105**: System MUST display appropriate labels (ADD, DELETE, MASK [range], RENAME KEY) on the right side of modified rows
- **FR-106**: System MUST show drag handle icons on all transformation rows to indicate reorderability

### Key Entities

- **Telemetry Data**: Hierarchical structure representing OpenTelemetry resource spans, containing nested sections for Resource attributes, Scope information, Span data (info, attributes), Events, and Links. Each attribute is a key-value pair.

- **Transformation**: An operation that modifies telemetry data. Types include:
  - **Add Static Attribute**: Creates a new key-value pair with a static value
  - **Add from Substring**: Creates a new attribute using a substring of an existing attribute value
  - **Delete Attribute**: Removes an attribute from the output
  - **Mask Value**: Replaces part or all of an attribute value with asterisks
  - **Rename Key**: Changes an attribute's key name while preserving its value
  - **Raw OTTL**: A transformation defined using OpenTelemetry Transformation Language syntax directly

- **Transformation Sequence**: An ordered list of transformations that are applied sequentially. The order determines the final output since transformations can build on or conflict with each other.

- **Section**: A top-level container in the telemetry hierarchy (Resource, Span Info, Span Attributes, Scope Info, Events, Links). Sections can be expanded or collapsed and track their own modification count.

## Sample Data

For this demo version, the system uses the following hardcoded telemetry sample representing an OpenTelemetry resource span from a Kubernetes pod:

**Structure Overview**:
- **Resource**: Contains 22 attributes describing a Kubernetes pod (`opentelemetry-demo-frontendproxy-58b488b55d-g7c4t`) including:
  - Dash0 identifiers (resource.id, resource.name, resource.type)
  - Kubernetes metadata (namespace, pod, deployment, node information)
  - Service identification (service.name, service.namespace)
  - Authentication token (dash0.auth.token: "hxZyXot") - suitable for masking demonstrations

- **Scope**: Empty scope with schema URL `https://opentelemetry.io/schemas/1.36.0`

- **Span**: Single span named "ingress" (kind: 2) with 20 attributes including:
  - Operation details (dash0.operation.name: "GET /ping", dash0.operation.type: "http")
  - HTTP details (method: GET, status: 404, protocol: HTTP/1.1)
  - Request/response metrics (request_size: 0, response_size: 4144)
  - Network information (peer.address: "10.1.217.83", full URL)
  - Identifiers (guid:x-request-id: "17f5e324-a633-9a19-a06f-a7b8e08fb1a4")
  - Timestamps and trace information

**Key Characteristics for Demo**:
- Realistic production-like data from an OpenTelemetry demo deployment
- Contains sensitive data suitable for masking (auth token, IPs, GUIDs)
- Rich attribute set for demonstrating various transformation operations
- Hierarchical structure demonstrates all telemetry sections (Resource, Scope, Span)
- Attribute values with substrings suitable for extraction (e.g., resource names, URLs, timestamps)

**Data Format**: The sample follows OpenTelemetry Protocol (OTLP) JSON format with resourceSpans containing resource attributes, scope information, and span data including attributes, events, and links.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view telemetry data in a readable, hierarchical format and understand its structure within 10 seconds of opening the application
- **SC-002**: Users can add a static attribute without any documentation or training by following visual cues and tooltips within 30 seconds
- **SC-003**: Users can remove an attribute and see the result in the preview within 15 seconds
- **SC-004**: Users can mask sensitive data in attribute values and preview the masked result within 20 seconds
- **SC-005**: Users can create complex transformation sequences with 5+ operations and reorder them without confusion
- **SC-006**: Users can complete a full transformation workflow (add/modify attributes, preview results) without needing to understand or write OTTL syntax
- **SC-007**: Advanced users can still apply raw OTTL statements when visual operations are insufficient
- **SC-008**: Users can identify at a glance which attributes will be added, deleted, masked, or renamed based on color coding and labels with 100% accuracy
- **SC-009**: Users can navigate and perform all operations using only keyboard shortcuts for efficiency
- **SC-010**: 90% of users successfully complete their first transformation and preview the result without external help
- **SC-011**: The system provides immediate visual feedback (within 100ms) for all user interactions (hover, click, drag, edit)
- **SC-012**: Users can resize panels to focus on either transformations or results based on their current task needs
- **SC-013**: Users can understand the sequential nature of transformations and how order affects the outcome
- **SC-014**: The interface remains responsive and usable even when displaying complex telemetry data with 50+ attributes across multiple sections
- **SC-015**: Users report high confidence in their transformations before executing them, due to clear visual indicators and labels
