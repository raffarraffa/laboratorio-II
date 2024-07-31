class Alert {
    addAlert(settings) {
        this.type = settings.type;
        this.title = settings.title || "Alert";
        this.message = settings.message;
        this.time = settings.time || 5000;

        let icon;
        let textColor;
        let classAlert;

        if (this.type === "success") {
            icon = "✔";
            textColor = "#64963b";
            classAlert = "alert__success";
        } else if (this.type === "error") {
            icon = "✘";
            textColor = "#963b3b";
            classAlert = "alert__error";
        }

        let alertContent = `
         <div class="alert ${classAlert}">
          <div class="alert__icon" style="color: ${textColor}">${icon}</div>
          <div class="alert__content">
            <h3 class="alert-title" >${this.title}</h3>
            <p class="alert-message">${this.message}</p>
          </div>
          <div class="alert__close" onclick="notify.closeWindow(event)">✘</div>
        </div>`;

        let alert = document.createElement("div");
        alert.innerHTML = alertContent;

        let notificationContainer = document.getElementById('notification-container');

        if (!notificationContainer) {
            notificationContainer = document.createElement("div");
            notificationContainer.id = "notification-container";
            notificationContainer.className = "notification-container";
            document.body.appendChild(notificationContainer);
        }

        notificationContainer.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, this.time);
    }

    closeWindow(event) {
        event.target.closest('.alert').remove();
    }
    /**
     * Muestra una alerta de éxito con el título, mensaje y tiempo dados.
     *
     * @param {string|null} [title=null] - El título de la alerta. Si no se proporciona, se usa el título predeterminado "Exito!".
     * @param {string|null} [msg=null] - El mensaje de la alerta.
     * @param {number} [time=null] - La duración en milisegundos durante la cual se debe mostrar la alerta. Si no se proporciona, se utiliza el valor predeterminado de 10000 milisegundos (10 segundos).
     * @return {void}
     */
    alertSucess = (title = null, msg = null, time = null) => {
        notify.addAlert({
            type: "success",
            title: title || "Exito!",
            message: msg || '',
            time: time || 10000
        });
    };
    /**
     * Muestra una alerta de éxito con el título, mensaje y tiempo dados.
     *
     * @param {string|null} [title=null] - El título de la alerta. Si no se proporciona, se usa el título predeterminado "Exito!".
     * @param {string|null} [msg=null] - El mensaje de la alerta.
     * @param {number} [time=null] - La duración en milisegundos durante la cual se debe mostrar la alerta. Si no se proporciona, se utiliza el valor predeterminado de 10000 milisegundos (10 segundos).
     * @return {void}
     */

    alertError = (title = null, msg = null, time = null) => {
        notify.addAlert({
            type: "error",
            title: title || "Error!",
            message: msg || '',
            time: time || 10000
        });
    };
}
const notify = new Alert();
