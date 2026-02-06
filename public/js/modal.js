// DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
  const modalHTML = `
    <div class="modal fade" id="modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" id="modalBody"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="modalSubmit">Submit</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insert modal into page
  document.getElementById("modalContainer").innerHTML = modalHTML;
});

// Modal Function 
let modalCallback = null;

function openModal(title, bodyContent, callback, options = {}) {
    modalCallback = callback;

    const modalEl = document.getElementById("modal");
    const modalDialog = modalEl.querySelector(".modal-dialog");
    const modalHeader = modalEl.querySelector(".modal-header");
    const modalTitleEl = modalEl.querySelector("#modalTitle");
    const modalBodyEl = modalEl.querySelector("#modalBody");
    const modalFooter = modalEl.querySelector(".modal-footer");
    const modalSubmitEl = modalEl.querySelector("#modalSubmit");
    const closeButton = modalEl.querySelector(".btn-close");

    // Reset to defaults
    modalDialog.className = "modal-dialog";
    modalHeader.className = "modal-header";
    modalHeader.style = "";
    modalBodyEl.className = "modal-body";
    modalFooter.className = "modal-footer";
    closeButton.className = "btn-close";
    
    // Apply custom options
    if (options.size) {
        modalDialog.classList.add(`modal-${options.size}`);
    }
    if (options.centered) {
        modalDialog.classList.add("modal-dialog-centered");
    }
    if (options.headerClass) {
        modalHeader.className = `modal-header ${options.headerClass}`;
    }
    if (options.headerStyle) {
        modalHeader.style = options.headerStyle;
    }
    if (options.bodyClass) {
        modalBodyEl.className = options.bodyClass;
    }
    if (options.footerClass) {
        modalFooter.className = `modal-footer ${options.footerClass}`;
    }
    if (options.closeButtonClass) {
        closeButton.className = `btn-close ${options.closeButtonClass}`;
    }

    // Use innerHTML for title to support icons/HTML
    modalTitleEl.innerHTML = title;
    modalBodyEl.innerHTML = bodyContent;

    // Handle footer visibility
    if (options.hideFooter) {
        modalFooter.style.display = "none";
    } else {
        modalFooter.style.display = "";
        
        // Handle submit button
        if (callback) {
            modalSubmitEl.style.display = "";
            modalSubmitEl.replaceWith(modalSubmitEl.cloneNode(true));
            const newSubmitEl = modalEl.querySelector("#modalSubmit");

            newSubmitEl.addEventListener("click", () => {
                if (modalCallback) {
                    const token = localStorage.getItem('token');  // ← ADD THIS LINE
                    modalCallback(token);  // ← CHANGE THIS LINE to pass token
                }
                const instance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                instance.hide();
            });
        } else {
            modalSubmitEl.style.display = "none";
        }
    }

    const modalInstance = new bootstrap.Modal(modalEl);
    modalInstance.show();
}

// Show success modal
function showSuccessModal(title, message) {
    const bodyContent = `
        <div class="text-center py-4">
            <i class="fas fa-check-circle text-success fa-3x mb-3"></i>
            <p class="mb-0">${message}</p>
        </div>
    `;

    openModal(
        `<i class="fas fa-check-circle me-2"></i>${title}`,
        bodyContent,
        null,
        {
            centered: true,
            headerClass: 'success-modal bg-success text-white',
            bodyClass: 'success-modal-body',
            closeButtonClass: 'btn-close-white',
            hideFooter: true
        }
    );
}

// Show error modal
function showErrorModal(title, message) {
    const bodyContent = `
        <div class="text-center py-4">
            <i class="fas fa-exclamation-circle text-danger fa-3x mb-3"></i>
            <p class="mb-0">${message}</p>
        </div>
    `;

    openModal(
        `<i class="fas fa-exclamation-circle me-2"></i>${title}`,
        bodyContent,
        null,
        {
            centered: true,
            headerClass: 'error-modal bg-danger text-white',
            bodyClass: 'error-modal-body',
            closeButtonClass: 'btn-close-white',
            hideFooter: true
        }
    );
}

// Show error in container
function showError(container, message) {
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
            <p class="text-danger">${message}</p>
        </div>
    `;
}