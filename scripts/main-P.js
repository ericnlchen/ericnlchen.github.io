import { createCircle } from "./svgUtil.js";
import { curlNoise } from "./curlNoise.js";

export function mainP() {
    const canvas = document.getElementById("background-canvas");
    const particlesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    particlesGroup.setAttribute("isolation", "isolate");
    canvas.appendChild(particlesGroup);
    const psHandle = document.getElementsByClassName("ps-handle")[0];

    let isDrawing = false;
    let mousePos = null;
    let particles = [];

    psHandle.addEventListener("mousedown", (e) => {
        psHandle.style.cursor = "grabbing";
        document.documentElement.style.cursor = "grabbing";
        isDrawing = true;
        mousePos = getMousePosition(e);
    })

    // Anim loop
    let rafId = null;
    let lastTime = 0;
    function update(dt) {
        const shrinkRate = 0.4 * 60;
        const particlesNew = [];
        for (const particle of particles) {
            const accel = curlNoise(particle.x, particle.y, Date.now());
            particle.vx += accel[0] * dt;
            particle.vy += accel[1] * dt;
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;
            particle.node.cx.baseVal.value = particle.x;
            particle.node.cy.baseVal.value = particle.y;
            

            const r = particle.node.r.baseVal.value - shrinkRate * dt;
            particle.node.r.baseVal.value = r;
            if (r > 0) {
                particlesNew.push(particle);
            }
            else {
                particle.node.remove();
            }
        }
        particles = particlesNew;
    }

    function spawn() {
        if (isDrawing) {
            const particle = createParticle(20);
            if (particle) {
                particles.push(particle);
            }
        }
    }

    setInterval(() => {
        spawn();
    }, 10);

    function frame(ts) {
        if (!lastTime) lastTime = ts;
        let dt = (ts - lastTime) / 1000; // seconds
        lastTime = ts;
        update(dt);
        rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    document.addEventListener("mouseup", () => {
        if (!isDrawing) return;
        document.documentElement.style.cursor = "auto";
        psHandle.style.cursor = "grab";
        isDrawing = false;
    })

    window.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;
        mousePos = getMousePosition(e);
    })

    function createParticle(radius = 20) {
        if (!mousePos) return null;
        const circle = createCircle(mousePos.x, mousePos.y, radius);
        particlesGroup.appendChild(circle);
        const animateFill = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animateFill.setAttribute("attributeName", "fill");
        animateFill.setAttribute("from", "#aa5500ff");
        animateFill.setAttribute("to", "#1b1111dd");
        animateFill.setAttribute("begin", "indefinite")
        animateFill.setAttribute("dur", "0.4s");
        animateFill.setAttribute("repeatCount", "1");
        animateFill.setAttribute("fill", "freeze");
        circle.appendChild(animateFill);
        animateFill.beginElement();
        const particle = {
            node: circle,
            x: mousePos.x + 15 * (Math.random() - 0.5),
            y: mousePos.y,
            vx: 0,
            vy: -250
        }
        return particle
    }

    function getMousePosition(evt) {
        const CTM = canvas.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d,
        };
    }
}