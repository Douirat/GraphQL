export function handle_user_level(level, totalXp = 0) {
  const user_level = document.getElementById("user_level");
  user_level.innerHTML = "";

  let ratio = level / 60;
  let radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - ratio);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100");
  svg.setAttribute("height", "100");
  svg.setAttribute("viewBox", "0 0 100 100");

  const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  bgCircle.setAttribute("cx", "50");
  bgCircle.setAttribute("cy", "50");
  bgCircle.setAttribute("r", radius);
  bgCircle.setAttribute("fill", "none");
  bgCircle.setAttribute("stroke", "#eee");
  bgCircle.setAttribute("stroke-width", "10");
  svg.appendChild(bgCircle);

  const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  progressCircle.setAttribute("cx", "50");
  progressCircle.setAttribute("cy", "50");
  progressCircle.setAttribute("r", radius);
  progressCircle.setAttribute("fill", "none");
  progressCircle.setAttribute("stroke", "green");
  progressCircle.setAttribute("stroke-width", "10");
  progressCircle.setAttribute("transform", "rotate(-90 50 50)");
  progressCircle.style.strokeDasharray = circumference;
  progressCircle.style.strokeDashoffset = offset;
  progressCircle.style.transition = "stroke-dashoffset 0.5s ease";
  svg.appendChild(progressCircle);

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", "50");
  text.setAttribute("y", "55");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", "16");
  text.setAttribute("fill", "#333");
  text.textContent = `${level}`;
  svg.appendChild(text);

  const level_description = document.createElement("p");
  level_description.textContent =
    level <= 10
      ? "Beginner"
      : level <= 20
        ? "Novice"
        : level <= 30
          ? "Intermediate"
          : level <= 40
            ? "Advanced"
            : level <= 50
              ? "Expert"
              : "Master";

  const xpLabel = document.createElement("label");
  xpLabel.textContent = `Total XP: ${(totalXp / 1000).toFixed(1)} kB`;
  xpLabel.style.marginTop = "10px";
  xpLabel.style.fontWeight = "bold";
  xpLabel.style.color = "#444";

  user_level.append(svg, level_description, xpLabel);
}
