// A WORK IN PROGRESS
class Marquee {
  constructor(options) {
    // ES6 this later
    this.element = options.element;
    this.gsap = options.gsap;
    this.originalContent = this.element.children[0];
    this.destroy = this.destroy.bind(this);

    this.setInstanceBounds();
    this.calculateRepetition();
    this.createWrapper();
    this.cloneNodes();
    this.animate();
    this.handleResize();
  }


  // Rename vars---- too long
  setInstanceBounds() {
    // make sure we calculate the non-block bounding box
    this.originalContent.style.display = `inline-block`;

    this.bounds = {
      element: this.element.getBoundingClientRect(),
      content: this.element.querySelector('.marquee-container').getBoundingClientRect()
    };
  }


  calculateRepetition() {
    const repetitions = (this.bounds.element.width + this.bounds.content.width) / this.bounds.content.width;
    this.repetitions = Math.ceil(repetitions);
    console.log(`Required repetitions: ${this.repetitions}`);
  }


  getChildren() {
    if (this.element.children.length > 1) {
      throw 'There is more than one child. Please only have one wrapper with `.marquee-container` selector.'
    } else {
      const elem = this.element.children[0];
      elem.classList.add('marquee-copy');
      return elem;
    }
  }


  createWrapper() {
    const wrapper  = document.createElement('div');
    wrapper.classList.add('marquee-wrapper');
    wrapper.style.whiteSpace = 'nowrap';
    this.element.appendChild(wrapper);
    this.element.style.overflow = 'hidden';
    this.wrapper = wrapper;
  }


  cloneNodes(amount) {
    [...Array(amount || this.repetitions)].map((val, index) => {
      const clone = this.originalContent.cloneNode(true);
      this.wrapper.appendChild(clone);
      return clone;
    });

    if (!amount) this.originalContent.remove();
  }


  animate() {
    if (this.timeline) {
      this.timeline.kill();
    }

    const tl = new this.gsap({
      onComplete: () => { tl.restart(); }
    });

    tl.set(this.wrapper, { x: 0 });
    tl.to(this.wrapper, 2, {
      x: this.bounds.content.width * -1,
      force3D: true,
      ease: Power0.easeNone
    });

    this.timeline = tl;
  }


  refresh() {
    const prevRepetitions = this.repetitions;

    this.calculateRepetition();

    const diff = this.repetitions - prevRepetitions;
    if (diff > 0) this.cloneNodes(diff);

    this.setInstanceBounds();
    this.animate();
  }

  
  handleResize() {
    window.addEventListener('resize', debounce(() => {
      this.refresh();
    }, 50));
  }


  destroy() {
    this.timeline.kill();
    this.element.children[0].remove();
    this.element.append(this.originalContent);
    delete window.marquees[this.name || this.index];
  }


  static init(options) {
    window.Marquees = {};
    const elems = [...document.querySelectorAll(options.selector || '.marquee')];

    elems.forEach((marquee, i) => {
      const instance = new Marquee({
        element: marquee,
        gsap: options.gsap
      });

      instance.index = i;
      window.Marquees[i] = instance;
    });
  }
}


function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};


export default Marquee;
