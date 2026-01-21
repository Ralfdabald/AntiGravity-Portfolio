import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Hero Animation ---
const initHero = () => {
    const tl = gsap.timeline();

    // Use .from() so text is visible by default (progressive enhancement)
    tl.from('.hero h1', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power4.out",
        stagger: 0.2
    })
        .from('.hero p', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.out"
        }, "-=0.5")
        .fromTo('.hero .btn',
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
                clearProps: "opacity,scale" // Clean up to avoid CSS conflicts
            },
            "-=0.3"
        );

    // Mouse Move Parallax
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to('.hero-elements', {
            x: x,
            y: y,
            duration: 1,
            ease: "power1.out"
        });
    });
};

// --- Color Shift on Scroll (Light Theme) ---
const initColorShift = () => {
    // Default (BG Primary) #f8fafc

    // Skills Section -> White for Canvas contrast
    ScrollTrigger.create({
        trigger: ".skills-section",
        start: "top center",
        end: "bottom center",
        onEnter: () => gsap.to("body", { backgroundColor: "#ffffff", duration: 1 }),
        onLeaveBack: () => gsap.to("body", { backgroundColor: "var(--color-bg-primary)", duration: 1 })
    });

    // Roadmap -> Subtle Warm Red/Rose
    ScrollTrigger.create({
        trigger: ".roadmap-section",
        start: "top center",
        end: "bottom center",
        onEnter: () => gsap.to("body", { backgroundColor: "#fff1f2", duration: 1 }), // Rose-50 (Stronger)
        onLeaveBack: () => gsap.to("body", { backgroundColor: "#ffffff", duration: 1 })
    });

    // Projects Section -> Distinct Slate Gray
    ScrollTrigger.create({
        trigger: ".projects-section",
        start: "top center",
        end: "bottom center",
        onEnter: () => gsap.to("body", { backgroundColor: "#e2e8f0", duration: 1 }), // Slate-200
        onLeaveBack: () => gsap.to("body", { backgroundColor: "#fff1f2", duration: 1 })
    });

    // Experience Section -> Back to White or Soft Blue
    ScrollTrigger.create({
        trigger: ".experience-section",
        start: "top center",
        onEnter: () => gsap.to("body", { backgroundColor: "#f8fafc", duration: 1 }),
        onLeaveBack: () => gsap.to("body", { backgroundColor: "#e2e8f0", duration: 1 })
    });

    // Contact Section -> Stronger Maroon Tint
    ScrollTrigger.create({
        trigger: ".contact-section",
        start: "top center",
        onEnter: () => gsap.to("body", { backgroundColor: "#fef2f2", duration: 1 }), // Red-50
        onLeaveBack: () => gsap.to("body", { backgroundColor: "#f8fafc", duration: 1 })
    });
};

// --- Roadmap Animation ---
const initRoadmap = () => {
    gsap.utils.toArray('.roadmap-node').forEach((node, i) => {
        gsap.from(node, {
            scrollTrigger: {
                trigger: node,
                start: "top 80%"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });
};

// --- Scroll Animations for Elements ---
const initScrollAnimations = () => {
    gsap.utils.toArray('section h2').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: "power2.out"
        });
    });
};

// --- Skill Canvas Graph ---
const initSkillGraph = () => {
    const canvas = document.getElementById('skillsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;

    // Skills Data
    const skills = [
        { name: "C#", x: 0, y: 0, vx: 0, vy: 0 },
        { name: "Python", x: 0, y: 0, vx: 0, vy: 0 },
        { name: "SQL", x: 0, y: 0, vx: 0, vy: 0 },
        { name: "HTML/CSS", x: 0, y: 0, vx: 0, vy: 0 },
        { name: "JavaScript", x: 0, y: 0, vx: 0, vy: 0 },
        { name: "WordPress", x: 0, y: 0, vx: 0, vy: 0 },
        { name: "Vercel", x: 0, y: 0, vx: 0, vy: 0 },
        { name: "Git", x: 0, y: 0, vx: 0, vy: 0 },
        { name: "DB Design", x: 0, y: 0, vx: 0, vy: 0 }
    ];

    const resize = () => {
        width = canvas.parentElement.offsetWidth;
        height = canvas.parentElement.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        // Randomize initial positions
        skills.forEach(skill => {
            skill.x = Math.random() * width;
            skill.y = Math.random() * height;
            skill.vx = (Math.random() - 0.5) * 1; // Velocity
            skill.vy = (Math.random() - 0.5) * 1;
        });
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(80, 0, 0, 0.1)'; // Maroon tint lines
        ctx.fillStyle = '#1e293b'; // Slate text
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';

        // Update positions
        skills.forEach(skill => {
            skill.x += skill.vx;
            skill.y += skill.vy;

            // Bounce off walls
            if (skill.x < 0 || skill.x > width) skill.vx *= -1;
            if (skill.y < 0 || skill.y > height) skill.vy *= -1;

            // Draw Node Text
            ctx.fillStyle = '#1e293b';
            ctx.fillText(skill.name, skill.x, skill.y + 4);

            // Draw connections
            skills.forEach(other => {
                const dx = skill.x - other.x;
                const dy = skill.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(skill.x, skill.y);
                    ctx.lineTo(other.x, other.y);
                    // Opacity based on distance
                    const opacity = 1 - (distance / 150);
                    ctx.strokeStyle = `rgba(80, 0, 0, ${opacity * 0.3})`;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    };

    animate();
};

window.addEventListener('load', () => {
    initHero();
    initColorShift();
    initScrollAnimations();
    initRoadmap();
    initSkillGraph();
});
