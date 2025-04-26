export function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
export function setResizeListeners(th, resizer) {
    let startX, startWidth;
  
    resizer.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent text selection
      startX = e.pageX;
      startWidth = th.offsetWidth;
  
      document.body.style.cursor = 'col-resize';
  
      const onMouseMove = (e) => {
        const newWidth = startWidth + (e.pageX - startX);
        th.style.width = `${newWidth}px`;
  
        // OPTIONAL: apply width to all <td> in this column if needed
        const index = Array.from(th.parentNode.children).indexOf(th);
        const rows = table.querySelectorAll(`tbody tr`);
        rows.forEach(row => {
          const cell = row.children[index];
          if (cell) cell.style.width = `${newWidth}px`;
        });
      };
  
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
      };
  
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }
  