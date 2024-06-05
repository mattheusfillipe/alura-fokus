// encontrar o botão adicionar tarefa

const btnAddTask = document.querySelector('.app__button--add-task')
const formAddTask = document.querySelector('.app__form-add-task')
const textArea = document.querySelector('.app__form-textarea')
const ulTarefas = document.querySelector('.app__section-task-list')
const btnCancelar = document.querySelector('.app__form-footer__button--cancel')
const btnConcluirSelecionada = document.querySelector('#btn-concluir-selecionada')
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')
const btnMore = document.querySelector('#btn-more')
const dropdown = document.querySelector('.app__section-task-header__ul')

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
let tarefaSelecionada = null
let liTarefaSelecionada = null


function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

btnMore.onclick = () => {
    dropdown.classList.toggle('hidden')
}

const limparForm = () => {
    textArea.value = ''
    formAddTask.classList.add('hidden')
}
btnCancelar.addEventListener('click', limparForm)

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
    `
    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')

    botao.onclick = () => {
        //debugger
        const novaDescricao = prompt("Qual o novo nome da tarefa?")
        //console.log('Nova descrição da tarefa: ', novaDescricao)
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            atualizarTarefas()
        }

    }

    const imagemBtn = document.createElement('img')
    imagemBtn.setAttribute('src', './imagens/edit.png')
    botao.append(imagemBtn)

    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                })

            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return
            }
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao

            li.classList.add('app__section-task-list-item-active')
        }
    }

    return li
}

btnAddTask.addEventListener('click', () => {
    formAddTask.classList.toggle('hidden')
})

formAddTask.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa)
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas()
    textArea.value = ''
    formAddTask.classList.add('hidden')
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
})

const checkSelect = () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
}

btnConcluirSelecionada.addEventListener('click', () => {
    checkSelect()
    dropdown.classList.toggle('hidden')
})

document.addEventListener('FocoFinalizdo', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

btnRemoverConcluidas.onclick = () => {
    const seletor = ".app__section-task-list-item-complete"
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    dropdown.classList.toggle('hidden')
    tarefas = tarefas.filter(tarefa => !tarefa.completa)
    atualizarTarefas()
}

btnRemoverTodas.onclick = () => {
    const seletor = ".app__section-task-list"
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    dropdown.classList.toggle('hidden')
    tarefas = []
    atualizarTarefas()
}