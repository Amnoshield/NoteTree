# Note Tree
 
A tree / mindmap style note taking app

# TODO (In no particular order):
- canvas
  - Add full canvas drag
  - Add full canvas zoom
  - Add automatic canvas drag / zoom to focused / selected node
  - Add saving & loading
    - Keep track of what node was selected
  - Add input handling
  - Add tiling background / custom background support
  - Add creating a new node
  - **low priority:** Add floating nodes (Nodes which can connect to each other and are not a tree)
- Nodes
  - Add keyboard via canvas input handling
  - Add adding new children
  - Add adding new siblings
  - Add remove currently selected node
    - what to do with children?
  - Add navigating nodes
    - When at an edge search higher up the tree (and try to stay at the same level)
    - If no higher siblings search for higher tree
    - If no options keep current selected node
    - A node must *ALWAYS* be selected
  - Add hiding / showing child nodes
    - When hiding must show the total number of nodes hidden
    - when a node is added children must be shown
    - add recursive hiding (so the child nodes will also collapse their children)
  - **low priority:** Add drag from point to add child node (mostly for the normies)
  - Add multi-select dragging
  - Add changing order (swapping positions in the DOM with prev or next sibling)
    - What to do when at limit of current parent
      - Follow the same rules as traversing nodes?
- General
  - Add settings
    - Control all node spacing
    - node width and height
    - Arrow settings? (i.e. color, width, radius)
    - Load custom css
  - Open other canvases in the same folder
  - Open folder with canvases in it
- After the basics are in place:
  - Add Helix inspired textarea
