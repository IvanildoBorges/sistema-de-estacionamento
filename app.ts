interface Vehicle {
    name: string
    plate: string
    entrance: Date | string
    clientId?: string
}

// //FICA DE DESAFIO COLOCAR A QUEM PERTENCE O VEICULO
// interface Person {
//     name: string
//     cpf: string
// }

// interface Client extends Person {
//     vehicle: Vehicle[]
// }


// Função auto-executável (IIFE) após o código carregar
(function() {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query)
    
    function calcTime(thousand: number): string {
        const minute = Math.floor(thousand / 60000)
        const second = Math.floor((thousand % 60000) / 1000)

        return `${minute}min e ${second}s`
    }

    function parkingLot() {
        //ler - retorna a lista de veiculos salva no armazenamento do dispositivo
        function read(): Array<Vehicle> {
            return localStorage.parking ? JSON.parse(localStorage.parking) : []
        }

        //salvar - salva a lista de veiculos no armazenamento do dispositivo
        function save(vehicle: Vehicle[]): void {
            localStorage.setItem("parking", JSON.stringify(vehicle))
        }
    
        //adicionar - adiciona novo veiculo a lista de veiculos
        function add(vehicle: Vehicle, toSave?: boolean): void {
            //criando linha para tabela
            const row = document.createElement("tr")
    
            row.innerHTML = `
                <td>${vehicle.name}</td>
                <td>${vehicle.plate}</td>
                <td>${vehicle.entrance}</td>
                <td>
                    <button type="button" class="delete" data-plate="${vehicle.plate}">X</button>
                </td>
            `
            row.querySelector(".delete")?.addEventListener('click', function () {
                remove(this.dataset.plate)
            })
    
            //Adicionando ao corpo da tabela
            $("#parking-lot")?.appendChild(row)

            //Salvar novo veiculo na lista de veiculos
            if (toSave) {
                save([...read(), vehicle])
            }
        }
    
        //remover
        function remove(plate: string): void {
            const { entrance, name } = read().find(vehicle => vehicle.plate === plate)
            const time = calcTime(new Date().getTime() - new Date(entrance).getTime())

            if (!confirm(`O veiculo ${name} permaneceu por ${time}. Deseja encerrar?`)) {
                return
            }

            save(read().filter(vehicle => vehicle.plate !== plate))
            render()
        }
    
        //rendenrizar na tela - renderiza as informações do patio na tela
        function render() {
            $("#parking-lot")!.innerHTML = ``

            const parking = read();

            if (parking.length) {
                parking.forEach(vehicle => add(vehicle))
            }
        }
    
        return { read, add, remove, save, render }
    }

    //Chamada para renderizar a lista de veiculos do patio
    parkingLot().render()

    //evento disparado no click do botão cadastrar
    $("#signup")?.addEventListener('click', (): void => {
        const name: string | undefined = $("#name")?.value      //input nome
        const plate: string | undefined = $("#plate")?.value    //input placa

        if (!name || !plate) {
            alert("Preencha os campos nome e placa para poder continuar!")
            return
        }

        parkingLot().add({ name, plate, entrance: new Date().toISOString() }, true)
    })
})()