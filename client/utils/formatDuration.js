export default function formatDuration(duration) {
  const timeInSeconds = duration / 1000;
  const minutes = Math.floor(timeInSeconds / 60);
  let seconds = String(Math.floor(timeInSeconds % 60));
  seconds = seconds.length === 1 ? `0${seconds}` : seconds;
  return `${minutes}:${seconds}`;
}
