// phase 2
import { Schema as S, pipe, Array, Option, HashMap } from "effect"

const searchbutton = document.getElementById("search-btn")!
const pkmnsearch = document.getElementById("search-pkmn") as HTMLInputElement;
const info = document.getElementById("pkmn-info")!;

searchbutton.addEventListener("click", () => {
    const pkmn = pkmnsearch.value.toLowerCase();
    fetch(`https://pokeapi.upd-dcs.work/api/v2/generation/1`)
        .then((resp) => resp.json())
        .then((gen1) => {
            const filtered = pipe(
                gen1.pokemon_species,
                Array.filter(s => gen1.startsWith(s.name, pkmn))
            )
            const pkmnPromises = pipe(
                filtered, 
                Array.map((s) =>
                    fetch(`https://pokeapi.upd-dcs.work/api/v2/pokemon/${s.name}`)
                    .then((resp) => resp.json())
                )
            )
            return Promise.all(pkmnPromises)
        })
        .then(pkmndata => {
            const sortedpkmn = pipe(
                pkmndata, 
                Array.sort((a,b) => a.id - b.id)
            )
            info.innerHTML = ""
            const grid = document.createElement("div")
            grid.style.display = "grid"
            grid.style.gridTemplateColumns = "auto auto auto"
            grid.style.gap = "1em"
        
            pipe(
                sortedpkmn,
                Array.forEach(s => {
                    const name = s.name.charAt(0).toUpperCase() + s.name.slice(1)
                    const types = pipe(
                        s.types,
                        Array.map((t) => s.capitalize(t.type.name))
                    );
                    const height = s.height / 10
                    const weight = s.weight / 10
                    const sprite = s.sprites.front_default

                    info.innerHTML = ""
                    const infoWrapper = document.createElement("div")
                    infoWrapper.style.display = "flex"
                    infoWrapper.style.alignItems = "center"
                    infoWrapper.style.gap = "1em"
                    
                    const img = document.createElement("img")
                    img.src = sprite
                    img.width = 150

                    const infoDiv = document.createElement("div")
                    
                    const displayName = document.createElement("h1")
                    displayName.textContent = name

                    const displayTags = document.createElement("p")
                    displayTags.innerHTML = pipe(
                        types,
                        Array.map((t) => `<code>${t}</code>`),
                        Array.join(" | ")
                    )

                    const displayHeight = document.createElement("p")
                    displayHeight.textContent = `Height : ${height} m`

                    const displayWeight = document.createElement("p")
                    displayWeight.textContent = `Weight: ${weight} kg`

                    infoDiv.append(displayName, displayTags, displayHeight, displayWeight)

                    infoWrapper.append(img, infoDiv)
                    info.append(infoWrapper)
        })
    )
        info.appendChild(grid)
    })
    })



// phase 1
// const pkmnText = document.getElementById("pkmn-text")!
// const searchbutton = document.getElementById("search-btn")!
// const pkmnsearch = document.getElementById("search-pkmn") as HTMLInputElement;


// searchbutton.addEventListener("click", () => {// fetch(...) returns a Promise<Response>
//     const pkmn = pkmnsearch.value.toLowerCase();
//     fetch(`https://pokeapi.upd-dcs.work/api/v2/pokemon/${pkmn}`).then((resp) => {// resp.text() returns a Promise<string>
//         resp.json().then((s) => {
//             const display = {
//             name : s.name,
//             types : s.types.map((t) => t.type.name),
//             height : s.height,
//             weight : s.weight
//             };
//             if (pkmnText) {
//             pkmnText.textContent = JSON.stringify(display, null, 5)
//             }
//         })
//     })
// })
