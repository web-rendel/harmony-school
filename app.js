document.addEventListener('DOMContentLoaded', () => {
  const copyLinks = document.querySelectorAll('.text-bg-secondary');

  copyLinks.forEach((copyLink) => {
    copyLink.addEventListener('click', (e) => {
      const parentBlock = e.target.closest('.d-flex');
      const link = parentBlock.querySelector('a');

      if (link) {
        const url = link.href;
        navigator.clipboard
          .writeText(url)
          .then(() => {
            const originalText = copyLink.textContent;
            copyLink.textContent = 'Copied!';
            setTimeout(() => {
              copyLink.textContent = originalText;
            }, 1000);
          })
          .catch((err) => {
            console.error('Не удалось скопировать текст:', err);
          });
      }
    });
  });
});
