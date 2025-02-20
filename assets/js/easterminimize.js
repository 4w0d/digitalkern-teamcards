function minimizeContainer() {
    const container = document.querySelector('.container');
    const textFile = document.querySelector('.text-file');
    container.classList.add('slide-out');
    container.addEventListener('animationend', () => {
        container.classList.remove('slide-out');
        container.classList.add('hidden');
        textFile.classList.add('fade-in');
        textFile.classList.remove('hidden');
    }, { once: true });
}

function maximizeContainer() {
    const container = document.querySelector('.container');
    const textFile = document.querySelector('.text-file');
    textFile.classList.add('fade-out');
    textFile.addEventListener('animationend', () => {
        textFile.classList.remove('fade-out');
        textFile.classList.add('hidden');
        container.classList.value = 'container';
    }, { once: true });
}
