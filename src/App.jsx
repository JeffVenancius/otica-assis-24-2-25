import './App.css';

import Header from './components/Header';
import DefaultBanner from './components/DefaultBanner';
import Footer from './components/Footer';
import ScrollToTop from './components/scrollToTop.jsx'
import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react';

import axios from 'axios'
import types from './data/types.json'
import urls from './data/urls.json'

function App() {
	const [currFilters, changeCurrFilters] = useState({})
	const [possibleFilters, setPossibleFilters] = useState([])
	const [totalItems, setTotalItems] = useState([])

	const getTypesList = () => {
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
		return typesList
	}

	useEffect(() => {
		let currSelections = window.location.pathname.split('/')
		let typesList = getTypesList()

		// for (let i = 0; i < Object.keys(urls).length; i++) {
		// 	for (let j = 0; j < currSelections.length; j++) {
		// 		if (urls[Object.keys(urls)[i]] === currSelections[j]) {
		// 			currSelections[j] = [Object.keys(urls)[i], currSelections[j]]
		// 			break
		// 		}
		// 	}
		// }

		// for (let i = 0; i < currSelections.length; i++) {
		// 	for (let j = 0; j < Object.keys(types).length; j++) {
		// 		let t = types[Object.keys(types)[j]]
		// 		if (t.includes(currSelections[i][0])) {
		// 			typesList[Object.keys(types)[j]] = currSelections[i]
		// 			break
		// 		}
		// 	}
		// }


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





		// let currSelection = window.location.pathname.replace("/","")
		// currSelection = currSelection ? currSelection : "default"
		// fetch('./data/items/' + currSelection + '.json', {method:"GET"})
		// 	.then(res => res.json())
		// 	.then(items => {
		// 		let possibleFiltersOut = [...Object.keys(urls)]
		// 		items.forEach(item => {
		// 			const filters = ["Tipo", "Gênero"]
		// 			filters.forEach(type => {
		// 				if (!possibleFilters.includes(item[type])) {
		// 					possibleFiltersOut.push(item[type])
		// 				}
		// 			})
		// 		})
		// 		setPossibleFilters(possibleFiltersOut)
		// 	})
	// },[])



	const setFilters = (filter, type) => {
		let newFilter = JSON.parse(JSON.stringify(currFilters))
		if (filter === "Todos") {
			delete newFilter[type]
		} else {
			newFilter[type] = filter
		}
		changeCurrFilters(newFilter)
	}

	const getPossibleFilters = () => {
		let typesAllowed = {"Grau/Sol": false, "Gênero": false, "Formato": false}
		let typesList = getTypesList()
		const name = 0
		for (const type in types) {
			if (!Object.keys(typesList).includes(type)) {
				typesAllowed[type] = true
			} else {
				typesAllowed[type] = typesList[type] 
			}
		}
		const possibleItems = []
		totalItems.forEach(item => {
			let typesFiltered = {"Grau/Sol": false, "Gênero": false, "Formato": false}
			for (const type in typesAllowed) {
				if (typesAllowed[type] === true) {
					typesFiltered[type] = true
				} else if (typesAllowed[type] === item[type]) {
					typesFiltered[type] = true
				}
			}
			let alltrue = true
			for (const key in typesFiltered) {
				if (!typesFiltered[key]) {
					alltrue = false
					break
				}
			}
			if (alltrue) {
				["Grau/Sol","Gênero", "Formato"].forEach(i => {
					if (!possibleItems.includes(item[i]) && item[i]) {
						possibleItems.push(item[i])
					}
				})
			}
		})
		return [...possibleItems, ...types["Marcas"]]
	}

	// useEffect(() => {
	// 	const params = new URLSearchParams(document.location.search)
	// 	if (Object.keys(currFilters).length) {
	// 	Object.keys(currFilters).forEach((k) =>
	// 		{
	// 			params.set(k, currFilters[k])
	// 		})
	// 			history.pushState({},"", currFilters && "?" + params.toString())
	// 	}
	// }, [currFilters])

	useEffect(() => {
		const params = new URLSearchParams(document.location.search)
		let out = {}
		for (const [key, value] of params) {
			out[key] = value
		}
		changeCurrFilters(out)
	}, [])

	const changeUrl = () => {
		changeCurrFilters({})
	}
  return (
		<>
		<ScrollToTop />
		<Header 
			headerLogo="/assets/Logotipo-Ótica-Assis-header.png"
			headerAlt="Logo Ótica Assis"
			setFilters={setFilters}
			currFilters={currFilters}
			possibleFilters={getPossibleFilters()}
			changeUrl={changeUrl}
		>
		<DefaultBanner/>
		</Header>
		<Outlet
			context={{totalItems, currFilters}}
		/>
		<Footer
			facebookLogo="/assets/fb_logo.png"
			instagramLogo="/assets/insta_logo.png"
			companyLogo="/assets/Logotipo-Ótica-Assis-footer.png"
		/>
		</>
  );
}

export default App;
