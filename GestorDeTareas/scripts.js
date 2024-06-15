document.addEventListener('DOMContentLoaded', () => {
    const formularioTarea = document.getElementById('formularioTarea');
    const listaTareas = document.getElementById('listaTareas');

    // Función para guardar tareas en el localStorage
    const guardarTareasEnLocalStorage = (tareas) => {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    };

    // Función para obtener tareas del localStorage
    const obtenerTareasDeLocalStorage = () => {
        return JSON.parse(localStorage.getItem('tareas')) || [];
    };

    // Función para renderizar tareas en la lista
    const renderizarTareas = (tareas) => {
        listaTareas.innerHTML = '';
        tareas.forEach(tarea => {
            const elementoTarea = document.createElement('li');
            elementoTarea.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');
            
            if (tarea.completada) {
                elementoTarea.classList.add('completada');
            } else if (new Date(tarea.fechaFin) < new Date()) {
                elementoTarea.classList.add('vencida');
            } else {
                elementoTarea.classList.add('pendiente');
            }

            elementoTarea.innerHTML = `
                <span>
                    <strong>${tarea.nombre}</strong> <br>
                    <small>Inicio: ${tarea.fechaInicio} | Fin: ${tarea.fechaFin} | Responsable: ${tarea.responsable}</small>
                </span>
                <span>
                    <button class="btn btn-sm btn-success marcar-completada" data-id="${tarea.id}" ${tarea.completada || new Date(tarea.fechaFin) < new Date() ? 'disabled' : ''}>Marcar</button>
                    <button class="btn btn-sm btn-warning desmarcar-completada" data-id="${tarea.id}" ${!tarea.completada ? 'hidden' : ''}>Desmarcar</button>
                    <button class="btn btn-sm btn-danger eliminar-tarea" data-id="${tarea.id}">Eliminar</button>
                </span>
            `;
            listaTareas.appendChild(elementoTarea);
        });
    };

    // Función para añadir una tarea
    const agregarTarea = (tarea) => {
        const tareas = obtenerTareasDeLocalStorage();
        tareas.push(tarea);
        guardarTareasEnLocalStorage(tareas);
        renderizarTareas(tareas);
    };

    // Función para marcar o desmarcar una tarea como completada
    const cambiarEstadoTarea = (id, completada) => {
        const tareas = obtenerTareasDeLocalStorage();
        const tarea = tareas.find(t => t.id === id);
        if (tarea) {
            tarea.completada = completada;
            guardarTareasEnLocalStorage(tareas);
            renderizarTareas(tareas);
        }
    };

    // Función para eliminar una tarea
    const eliminarTarea = (id) => {
        let tareas = obtenerTareasDeLocalStorage();
        tareas = tareas.filter(tarea => tarea.id !== id);
        guardarTareasEnLocalStorage(tareas);
        renderizarTareas(tareas);
    };

    // Evento para manejar el envío del formulario
    formularioTarea.addEventListener('submit', (event) => {
        event.preventDefault();
        const nombreTarea = document.getElementById('nombreTarea').value;
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const responsable = document.getElementById('responsable').value;

        if (new Date(fechaFin) < new Date(fechaInicio)) {
            alert('La fecha de fin no puede ser menor que la fecha de inicio.');
            return;
        }

        const tarea = {
            id: Date.now(),
            nombre: nombreTarea,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            responsable: responsable,
            completada: false
        };

        agregarTarea(tarea);
        formularioTarea.reset();
    });

    // Evento para manejar los clics en los botones de la lista de tareas
    listaTareas.addEventListener('click', (event) => {
        if (event.target.classList.contains('marcar-completada')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            cambiarEstadoTarea(id, true);
        }

        if (event.target.classList.contains('desmarcar-completada')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            cambiarEstadoTarea(id, false);
        }

        if (event.target.classList.contains('eliminar-tarea')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            eliminarTarea(id);
        }
    });

    // Renderizar tareas al cargar la página
    renderizarTareas(obtenerTareasDeLocalStorage());
});
