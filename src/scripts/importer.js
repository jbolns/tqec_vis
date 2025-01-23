
// ##################################
// FETCH
// ##################################
//
//
// GET RAW DATA FROM JSON
const get_data = async (data_filename) => {
  const response = await fetch(`../../data/${data_filename}`);
  const data = await response.json();
  return data
}

// ##################################
// FORMAT
// ##################################
//
//
// EXTRACT NODES FROM DATA
const get_blocks = async (data_filename) => {

  // FETCH & EXTRACT FROM FOUNDATIONAL DATA
  const data = await get_data(data_filename)
  const wire_vertices = data["wire_vertices"]
  const nodes = data["node_vertices"]

  // POPULATE ARRAY WITH NODES
  // Dictionary to hold final nodes
  let B = {}

  // Get main blocks
  for (const key in nodes) {
    const entries = Object.entries(nodes[key]);
    B[key] = { "type": entries[1][1]["type"], "coord": entries[0][1]["coord"] }
  }

  // Get vertices
  for (const key in wire_vertices) {
    const entries = Object.entries(wire_vertices[key]);
    B[key] = { "type": "boundary", "coord": entries[0][1]["coord"] }
  }

  // RETURN JOINT RESULT
  return B
}

// EXTRACT VERTICES FROM DATA
const get_edges = async (data_filename, BLOCKS) => {

  // FETCH & EXTRACT FROM FOUNDATIONAL DATA
  const data = await get_data(data_filename)
  const edges = data["undir_edges"]

  // POPULATE ARRAY WITH EDGES
  // Array to hold final edges
  const E = {}

  // Get edges and calculate coordinates
  for (const key in edges) {
    const entries = Object.entries(edges[key]);

    let delta_x = BLOCKS[entries[1][1]]["coord"]["position_x"] - BLOCKS[entries[0][1]]["coord"]["position_x"]
    let delta_y = BLOCKS[entries[1][1]]["coord"]["position_y"] - BLOCKS[entries[0][1]]["coord"]["position_y"]
    let delta_z = BLOCKS[entries[1][1]]["coord"]["position_z"] - BLOCKS[entries[0][1]]["coord"]["position_z"]

    let start_x = BLOCKS[entries[0][1]]["coord"]["position_x"]
    let start_y = BLOCKS[entries[0][1]]["coord"]["position_y"]
    let start_z = BLOCKS[entries[0][1]]["coord"]["position_z"]

    E[key] = {
      "position_x": start_x + delta_x / 2,
      "position_y": start_y + delta_y / 2,
      "position_z": start_z + delta_z / 2,
      "rotation_x": BLOCKS[entries[0][1]]["coord"]["rotation_x"],
      "rotation_y": BLOCKS[entries[0][1]]["coord"]["rotation_y"],
      "rotation_z": BLOCKS[entries[0][1]]["coord"]["rotation_z"],
      "scale_x": Math.max(1, delta_x),
      "scale_y": Math.max(1, delta_y),
      "scale_z": Math.max(1, delta_z),
    }
  }

  // RETURN JOINT RESULT
  return E
}


// ##################################
// EXPORTS
// ##################################
//
//
export { get_blocks, get_edges }

