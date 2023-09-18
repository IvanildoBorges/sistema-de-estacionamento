interface Vehicle {
    name: string
    plate: string
    entrance: Date
}

// Função auto-executável (IIFE) após o código carregar
(function() {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query)
    
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
    
            //Adicionando ao corpo da tabela
            $("#parking-lot")?.appendChild(row)

            //Salvar novo veiculo na lista de veiculos
            if (toSave) {
                save([...read(), vehicle])
            }
        }
    
        //remover
        function remove(): void {}
    
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

        parkingLot().add({ name, plate, entrance: new Date() }, true)
    })
})()