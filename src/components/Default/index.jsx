import urls from '../../data/urls.json'
import Card from '../Card'
import Pagination from '../Pagination'
import { useOutletContext } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import './Default.css'

const Default = (props) => {
	const topRef = useRef()
	const context = useOutletContext()
	const [page, setPage] = useState(1)
	const [totalItems, setTotalItems] = useState([])
	const [order, setOrder] = useState("")
	const [selection, setSelection] = useState(props.customSelection ? props.customSelection : "")
	const itemsPerPage = 6

	useEffect(() => {
		let currSelection = window.location.pathname.replace("/","")
		currSelection = currSelection ? currSelection : "default"
		import('./data/items/' + currSelection + '.json')
			.then(items_default => {
				const items = items_default['default']
				for (let i = 0; i < Object.keys(urls).length; i++) {
					if (urls[Object.keys(urls)[i]] === currSelection) {
						currSelection = Object.keys(urls)[i]
						if (!selection) setSelection(currSelection)
					} 
				}
				let currCards = []

				// const keys = Object.keys(items)
				for (let key = 0; key < items.length; key++) {
					let tipo = false
					let genero = false
					const filtersKeys = Object.keys(context.currFilters)
					if (filtersKeys.includes("Tipo")) {
						if (items[key]["Tipo"] === context.currFilters["Tipo"] || context.currFilters["Tipo"] === "Todos") {
							tipo = true
						}
					} else {
						tipo = true
					}
					if (filtersKeys.includes("Gênero")) {
						if (items[key]["Gênero"] === context.currFilters["Gênero"] || context.currFilters["Gênero"] === "Todos") {
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
	}, [])

	const changePage = (nextPage) => {
		setPage(nextPage)
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

	const totalItems_sorted = totalItems.sort((a,b) => {
			if (order === "Menor Preço") return a['preco'] > b['preco'] ? 1 : -1
			if (order === "Maior Preço") return a['preco'] > b['preco'] ? -1 : 1
			return 0
	})

	const totalItems_split = totalItems_sorted.splice(startPg, endPg)

	return (
		<>
		<div className='title__cards' ref={topRef}>
			<h1>{selection}</h1>
			<h2>{context.currFilters["Tipo"]}</h2>
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


