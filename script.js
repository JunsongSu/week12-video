class House {
    constructor(name){
        this.name = name;
        this.rooms = [];
    }
}

class Room {
    constructor(name,area){
        this.name = name;
        this.area = area;
    }
}

class HouseService {
    static url ='https://65e551a73070132b3b25d7bd.mockapi.io/houses';

    static getAllHouses(){
        return $.get(this.url);
    }

    static getHouse(id){
        return $.get(this.url +`/${id}`);
    }

    static createHouse(house){
        return $.post(this.url, house);
    }

    static updateHouse (house) {
        return $.ajax({
            url:this.url +`/${house._id}`,
            dataType:'json',
            data: JSON.stringify(house),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteHouse(id){
        return $.ajax({
            url: this.url+`/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager{
    static houses;

    getAllHouses(){
        HouseService.getAllHouses().then(houses=> this.render(houses));
    }

    static deleteHouse (id){
        HouseService.deleteHouse(id)
        .then(()=>{
            return HouseService.getAllHouses();
        })
        .then(houses=> 
        this.render(houses));
    }

    static createHouse(name){
        HouseService.createHouse(new House(name))
        .then(()=>{
            return HouseService.getAllHouses();
        })
        .then(houses=> 
        this.render(houses));
    }

    static addRoom (id){
        for (let house of this.houses){
            if (house.id == id){
                house.room.push(new Room($(`#${house._id}-room-name`).val(),$(`#${house._id}-room-area`).val()))
            }
        }
        HouseService.createHouse(new House(name))
        .then(()=>{
            return HouseService.getAllHouses();
        })
        .then(houses=> 
        this.render(houses));
    }

    

    render(houses){
        this.houses = houses;
        console.log(houses)
        $('#app').empty();
        for(let house of houses){

            $('#app').prepend(
                `<div id="${house.id}" class="card">
                    <div class = "card-header">
                        <h2>${house.name}</h2>
                        <button class="btn btn-danger" onclick ="DOMManager.deleteHouse(${house.id})"> Delete </button>
                    </div>

                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                <input type="text" id="${house.id}-room-name" class="form-control" placeholder="Room Name">
                                </div>
                                <div class="col-sm">
                                <input type="text" id="${house.id}-room-area" class="form-control" placeholder="Room Area">
                                </div>
                            </div>
                            <button id="${house.id}-new-room" onclick="DOMManager.addRoom('${house.id}')" class="btn btn-primary">Add</button>
                        </div>
                    </div>
                </div>
                `
            );
            console.log(house.rooms)
            for(let room of house.rooms){
                console.log(room, house.id)
                //console.log(document.querySelector('.card-body'))
                $(`${house.id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${room}"><strong>Name: </strong> ${room.name}</span>
                        <span id="name-${room}"><strong>Area: </strong> ${room.area}</span>
                        <button class="btn btn-primary" onclick="DOMManager.deleteRoom('${house.id}','${room}')>Delete Room</button>
                    </p>    
                    `
                );
            }

        }
    }
}



let domManager = new DOMManager();
domManager.getAllHouses();
domManager.render();
