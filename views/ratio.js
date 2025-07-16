export function handle_user_ratio(ratio) {
  console.log("ratio : ", ratio);

  let audit_ratio = Math.round(ratio.auditRatio * 100) / 100;

  let ratio_container = document.getElementById("svg_ratio");
  ratio_container.innerHTML = ""; // Clear previous SVG if any

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100");
  svg.setAttribute("height", "100");
  svg.setAttribute("viewBox", "0 0 100 100");

  // Constants for the circle
  const radius = 45;

  // Choose color based on ratio
  const color =
    audit_ratio < 0.5 ? "red" : audit_ratio < 1.2 ? "orange" : "green";
  const stroke_color =
    audit_ratio < 0.5 ? "white" : audit_ratio < 1.2 ? "green" : "white";

  // Foreground progress circle
  const progressCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  progressCircle.setAttribute("cx", "50");
  progressCircle.setAttribute("cy", "50");
  progressCircle.setAttribute("r", radius);
  progressCircle.setAttribute("fill", color);
  progressCircle.setAttribute("stroke", stroke_color);

  // Text in the middle
  const content = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  content.setAttribute("x", "50");
  content.setAttribute("y", "55");
  content.setAttribute("text-anchor", "middle");
  content.setAttribute("font-size", "16");
  content.setAttribute("fill", "white");
  content.textContent = `${audit_ratio}`;

  let text = document.createElement("div");
  text.setAttribute("id", "ratio_message");
  text.textContent =
    audit_ratio < 0.5
      ? "Do more audits!"
      : audit_ratio < 1.2
        ? "you can do better!"
        : "you are perfect";
  text.style.color = color;

  svg.appendChild(progressCircle);
  svg.appendChild(content);
  ratio_container.appendChild(svg);
  ratio_container.appendChild(text);
}

// Handle given and taken ratios with responsive fixes
export function handle_given_taken_xps(ratio) {
  const container = document.getElementById("given_taken");
  const definition = document.getElementById("definition");

  if (!container) return;

  const total_xp = ratio.totalUp + ratio.totalDown;

  if (total_xp === 0) {
    console.warn("Total XP is zero, cannot create bars.");
    return;
  }

  const up_percentage = ratio.totalUp / total_xp;
  const down_percentage = ratio.totalDown / total_xp;

  const svgNS = "http://www.w3.org/2000/svg";

  // Create definition section (keeping your logic)
  let given = document.createElement("div");
  given.setAttribute("class", "give_take");
  let given_quad = document.createElement("div");
  given_quad.setAttribute("id", "given_quad");
  let given_text = document.createElement("small");
  given_text.setAttribute("id", "given_text");
  given_text.textContent = `taken ${Math.round((ratio.totalDown / 1000000) * 100) / 100} mb`;

  given.append(given_quad, given_text);

  let taken = document.createElement("div");
  taken.setAttribute("class", "give_take");
  let taken_quad = document.createElement("div");
  taken_quad.setAttribute("id", "taken_quad");
  let taken_text = document.createElement("small");
  taken_text.setAttribute("id", "taken_text");
  taken_text.textContent = `Received ${Math.round((ratio.totalUp / 1000000) * 100) / 100} mb`;

  taken.append(taken_quad, taken_text);

  definition.innerHTML = ""; // Clear previous content
  definition.append(given, taken);

  // Function to create the SVG bars (responsive)
  const createBars = () => {
    // Better responsive width calculation
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const fallbackWidth = Math.min(300, window.innerWidth - 80);
    const totalWidth = containerWidth > 0 ? containerWidth : fallbackWidth;

    const rectHeight = 10;
    const gap = 5;
    const svgHeight = rectHeight * 2 + gap;

    const receivedWidth = Math.max(up_percentage * totalWidth, 2); // Minimum 2px width
    const givenWidth = Math.max(down_percentage * totalWidth, 2); // Minimum 2px width

    // Remove existing SVG if any
    const existingSvg = container.querySelector('svg');
    if (existingSvg) existingSvg.remove();

    // Create responsive SVG
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("viewBox", `0 0 ${totalWidth} ${svgHeight}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.display = "block";
    svg.style.maxWidth = "100%";

    // Background bars for better visual feedback
    const receivedBg = document.createElementNS(svgNS, "rect");
    receivedBg.setAttribute("x", 0);
    receivedBg.setAttribute("y", 0);
    receivedBg.setAttribute("width", totalWidth);
    receivedBg.setAttribute("height", rectHeight);
    receivedBg.setAttribute("fill", "#e2e8f0");
    receivedBg.setAttribute("rx", 2);

    const givenBg = document.createElementNS(svgNS, "rect");
    givenBg.setAttribute("x", 0);
    givenBg.setAttribute("y", rectHeight + gap);
    givenBg.setAttribute("width", totalWidth);
    givenBg.setAttribute("height", rectHeight);
    givenBg.setAttribute("fill", "#e2e8f0");
    givenBg.setAttribute("rx", 2);

    // Progress bars (keeping your original colors)
    const receivedRect = document.createElementNS(svgNS, "rect");
    receivedRect.setAttribute("x", 0);
    receivedRect.setAttribute("y", 0);
    receivedRect.setAttribute("width", receivedWidth);
    receivedRect.setAttribute("height", rectHeight);
    receivedRect.setAttribute("fill", "green");
    receivedRect.setAttribute("rx", 2);

    const givenRect = document.createElementNS(svgNS, "rect");
    givenRect.setAttribute("x", 0);
    givenRect.setAttribute("y", rectHeight + gap);
    givenRect.setAttribute("width", givenWidth);
    givenRect.setAttribute("height", rectHeight);
    givenRect.setAttribute("fill", "red");
    givenRect.setAttribute("rx", 2);

    // Append elements
    svg.appendChild(receivedBg);
    svg.appendChild(givenBg);
    svg.appendChild(receivedRect);
    svg.appendChild(givenRect);
    
    container.appendChild(svg);
  };

  // Create initial bars
  createBars();

  // Handle window resize with debouncing
  if (window.ratioResizeHandler) {
    window.removeEventListener("resize", window.ratioResizeHandler);
  }
  
  let resizeTimeout;
  window.ratioResizeHandler = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createBars();
    }, 150);
  };
  
  window.addEventListener("resize", window.ratioResizeHandler);
}