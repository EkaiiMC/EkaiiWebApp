export interface GalleryCoordinates {
  x: number,
  y: number,
  z: number,
  dimension: "overworld" | "nether" | "end"
}

export function coordinatesToString(coords: GalleryCoordinates) {
  let baseCoords = `${coords.x}, ${coords.y}, ${coords.z}`;
  if (coords.dimension !== "overworld") {
    const capitalizedDimension = coords.dimension.charAt(0).toUpperCase() + coords.dimension.slice(1);
    baseCoords += ` | ${capitalizedDimension}`;
  }
  return baseCoords;
}

export function getBlueMapURL(coords: GalleryCoordinates) {
  const dimension_name = coords.dimension === "overworld" ? "world" : coords.dimension === "nether" ? "world_nether" : "world_the_end";
  return `https://map.ekaii.fr/#${dimension_name}:${coords.x}:${coords.y}:${coords.z}:300:0:0:0:0:perspective`;
}