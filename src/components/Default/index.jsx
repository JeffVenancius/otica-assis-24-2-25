import urls from '../../data/urls.json'
import types from '../../data/types.json'
import Card from '../Card'
import Pagination from '../Pagination'
import { useOutletContext } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import './Default.css'
import axios from 'axios'

const Default = (props) => {
	const topRef = useRef()
	const context = useOutletContext()
	const [page, setPage] = useState(1)
	const [totalItems, setTotalItems] = useState([])
	const [order, setOrder] = useState("")
	const [selection, setSelection] = useState(props.customSelection ? props.customSelection : "")
	const itemsPerPage = 6

	useEffect(() => {
		let currSelections = window.location.pathname.split('/')
		let typesList = {}

		for (let i = 0; i < Object.keys(urls).length; i++) {
			for (let j = 0; j < currSelections.length; j++) {
				if (urls[Object.keys(urls)[i]] === currSelections[j]) {
					currSelections[j] = [Object.keys(urls)[i], currSelections[j]]
					break
				}
			}
		}

		for (let i = 0; i < currSelections.length; i++) {
			for (let j = 0; j < Object.keys(types).length; j++) {
				let t = types[Object.keys(types)[j]]
				if (t.includes(currSelections[i][0])) {
					typesList[Object.keys(types)[j]] = currSelections[i]
					break
				}
			}
		}

		const name = 0
		const urlName = 1
		if (Object.keys(typesList).includes("Marcas")) {
			let currCards = []
			fetch('/data/items/' + typesList['Marcas'][urlName] + '.json', {method: 'GET'})
				.then(res => res.json())
				.then(items => {
					for (let key = 0; key < items.length; key++) {
						let tipo = false
						let genero = false
						const filtersKeys = Object.keys(typesList)
						if (filtersKeys.includes("Grau/Sol")) {
							if (items[key]["Grau/Sol"] === typesList["Grau/Sol"][name]) {
								tipo = true
							}
						} else {
							tipo = true
						}
						if (filtersKeys.includes("Gênero")) {
							if (items[key]["Gênero"] === typesList["Gênero"][name]) {
								genero = true
							}
						} else {
							genero = true
						}
						if (tipo && genero) {
							if (typeof items[key][Object.keys(items[key])[0]] !== 'object') {
								if (!currCards.includes(items[key])) {
									currCards.push(items[key])
								}
							}
						} 
					}
					setTotalItems(currCards)
				})
		} else {
			let promises = []
			for (let i = 0; i < Object.keys(urls).length; i++) {
				let url = urls[Object.keys(urls)[i]]
				if (url) promises.push(axios.get('/data/items/' + url +'.json'))
				let currCards = []
				axios.all(promises)
					.then(
						axios.spread((...allData) => {
							allData.forEach((data) => {
								if (typeof data['data'] === 'object') {
									currCards.push(...data['data'])
								}
							})
							setTotalItems(currCards)
						})
					)
			}
		}
	}, [])

	const changePage = (nextPage) => {
		setPage(nextPage)
	}

	const get_filtered_items = () => {
		let currSelections = window.location.pathname.split('/')
		let typesList = {}
		let currCards = []

		for (let i = 0; i < Object.keys(urls).length; i++) {
			for (let j = 0; j < currSelections.length; j++) {
				if (urls[Object.keys(urls)[i]] === currSelections[j]) {
					currSelections[j] = [Object.keys(urls)[i], currSelections[j]]
					break
				}
			}
		}

		for (let i = 0; i < currSelections.length; i++) {
			for (let j = 0; j < Object.keys(types).length; j++) {
				let t = types[Object.keys(types)[j]]
				if (t.includes(currSelections[i][0])) {
					typesList[Object.keys(types)[j]] = currSelections[i]
					break
				}
			}
		}
		const name = 0
		const urlName = 1
		for (let key = 0; key < totalItems.length; key++) {
			let tipo = false
			let genero = false
			const filtersKeys = Object.keys(typesList)
			if (filtersKeys.includes("Grau/Sol")) {
				if (totalItems[key]["Grau/Sol"] === typesList["Grau/Sol"][name]) {
					tipo = true
				}
			} else {
				tipo = true
			}
			if (filtersKeys.includes("Gênero")) {
				if (totalItems[key]["Gênero"] === typesList["Gênero"][name]) {
					genero = true
				}
			} else {
				genero = true
			}
			if (tipo && genero) {
				if (!currCards.includes(totalItems[key])) {
					currCards.push(totalItems[key])
				}
			} 
		}
		return currCards
	}

	useEffect(() => topRef.current?.scrollIntoView({behavior: 'smooth'}),[page])

	const changeOrder = (e) => {
		setOrder(e.target.value)
	}

	useEffect(() => setPage(1), [order])
	const startPg = Math.max(0, (page - 1) * itemsPerPage)
	const endPg = Math.min(totalItems.length, startPg + itemsPerPage)

	useEffect(() => {
		setPage(1)
	},[])


	if (!totalItems.length) {
		return (
			<></>
		)
	}

	const totalItems_sorted = get_filtered_items().sort((a,b) => {
		if (order === "Menor Preço") return a['preco'] > b['preco'] ? 1 : -1
		if (order === "Maior Preço") return a['preco'] > b['preco'] ? -1 : 1
		return 0
	})

	const totalItems_split = totalItems_sorted.slice(startPg, endPg)
	return (
		<>
		<div className='title__cards' ref={topRef}>
		<h1>{selection}</h1>
		<h2>{context.currFilters["Grau/Sol"]}</h2>
		<h2>{context.currFilters["Gênero"]}</h2>
		</div>
		<div className='order__container'>
		<select name="Ordem" onChange={changeOrder}>
		<option value="Ordem">Ordem</option>
		<option value="Menor Preço">Menor Preço</option>
		<option value="Maior Preço">Maior Preço</option>
		</select>
		</div>
		<div className="cards__container">
		{totalItems_split.map(e => {
			const key = e["marca"].replace(" ", "__") + e["modelo"].replace(" ", "__") + e["wppDesc"].replace(" ", "__") + e["preco"]
			return (
				<Card 
				key={"card__" + key}
				marca={e["marca"]} 
				tipoDeCard={e["tipoDeCard"]} 
				modelo={e["modelo"]} 
				imgs={e["imgs"]} 
				preco={e["preco"]} 
				precoPromo={e["precoPromo"]} 
				wppDesc={e["wppDesc"]}
				/>
			)})}
		</div>
		<Pagination 
		changePage={changePage}
		currPage={page}
		pages={Math.ceil(totalItems.length / itemsPerPage)}
		/>
		</>
	)
}

export default Default


