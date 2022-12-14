export function getRandomLoadingText(): string {
  const options = [
    "Reticulating splines...",
    "Swapping time and space...",
    "Spinning violently around the y-axis...",
    "Tokenizing real life...",
    "Filtering morale...",
    "Crumbling breadcrumbs...",
    "Weighing the ocean...",
    "Reinventing the wheel...",
    "Compiling the sun...",
    "Translating the moon...",
    "Rendering the universe...",
    "Washing the dishes...",
    "Contacting spline reticulation server...",
    "Destabilizing orbital payloads...",
    "Unsequencing genomes...",
    "Picking berries...",
    "Loading more than you ever thought possible...",
    "Training neural networks...",
    "Nerfing the sun...",
    "Buffing the sun...",
    "Downloading more RAM...",
    "Uploading surplus RAM...",
    "Solving the halting problem...",
    "Proving P=NP...",
  ];
  return options[Math.floor(Math.random() * options.length)];
}
