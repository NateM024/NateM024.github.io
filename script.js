// Interactive terminal
const terminalInput = document.getElementById('terminal-input');
const inputDisplay = document.getElementById('input-display');
const terminalContent = document.getElementById('terminal-content');
const inputLine = document.getElementById('input-line');
const cursor = document.querySelector('#input-line .cursor');

const commands = {
    'help': 'Available commands: help, about, projects, in-progress, skills, contact, clear, ls, cd [section]',
    'ls': 'about.txt  projects/  in-progress/  skills.json  contact.md',
    'about': 'Navigating to about section...',
    'projects': 'Navigating to projects section...',
    'in-progress': 'Navigating to in-progress section...',
    'skills': 'Navigating to skills section...',
    'contact': 'Navigating to contact section...',
    'clear': 'CLEAR_TERMINAL'
};

// Update display as user types
terminalInput.addEventListener('input', () => {
    inputDisplay.textContent = terminalInput.value;
});

// Auto-focus on terminal input when clicking the terminal
document.querySelector('.terminal-window').addEventListener('click', () => {
    terminalInput.focus();
});

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const command = terminalInput.value.trim().toLowerCase();
        
        if (command) {
            // Display the command
            const commandLine = document.createElement('div');
            commandLine.className = 'terminal-line';
            commandLine.innerHTML = `<span class="prompt">user@localhost:~$</span> <span class="command">${terminalInput.value}</span>`;
            
            // Insert before the input line
            terminalContent.insertBefore(commandLine, inputLine);
            
            // Process command
            handleCommand(command);
        }
        
        terminalInput.value = '';
        inputDisplay.textContent = '';
    } else if (e.key === 'Tab') {
        e.preventDefault();
        // Simple tab completion for commands
        const input = terminalInput.value.toLowerCase();
        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            terminalInput.value = matches[0];
            inputDisplay.textContent = matches[0];
        }
    }
});

function handleCommand(command) {
    const parts = command.split(' ');
    const cmd = parts[0];
    const arg = parts[1];

    // Handle cd command
    if (cmd === 'cd' && arg) {
        const section = arg.replace('/', '');
        if (['about', 'projects', 'in-progress', 'skills', 'contact'].includes(section)) {
            addOutput(`Changing directory to ${section}...`);
            setTimeout(() => {
                document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
            }, 500);
            return;
        } else {
            addOutput(`cd: ${arg}: No such directory`);
            return;
        }
    }

    // Handle navigation commands
    if (['about', 'projects', 'in-progress', 'skills', 'contact'].includes(cmd)) {
        addOutput(commands[cmd]);
        setTimeout(() => {
            document.getElementById(cmd).scrollIntoView({ behavior: 'smooth' });
        }, 500);
        return;
    }

    // Handle clear
    if (cmd === 'clear') {
        // Remove all lines except the input line
        const lines = terminalContent.querySelectorAll('.terminal-line:not(#input-line)');
        lines.forEach(line => line.remove());
        return;
    }

    // Handle other commands
    if (commands[cmd]) {
        addOutput(commands[cmd]);
    } else {
        addOutput(`bash: ${cmd}: command not found`);
        addOutput(`Type 'help' for available commands`);
    }
}

function addOutput(text) {
    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line output';
    outputLine.textContent = text;
    terminalContent.insertBefore(outputLine, inputLine);
    
    // Scroll to bottom
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Add active state to navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});