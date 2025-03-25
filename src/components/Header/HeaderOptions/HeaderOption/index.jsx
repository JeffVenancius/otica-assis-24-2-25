import { Link } from "react-router-dom"
import urls from '../../../../data/urls.json'
import types from '../../../../data/types.json'

const HeaderOption = (props) => {
	let url = []
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
				typesList[Object.keys(types)[j]] = currSelections[i][1]
				break
			}
		}
	}
	if (props.type !== 'Marcas') {
		typesList[props.type] = props.url ? props.url : ''
		if (props.value === "Todos") {
			typesList[props.type] = ''
		}


		if (Object.keys(typesList).includes("Marcas")) {
			url.push(typesList['Marcas'])
		}
		if (Object.keys(typesList).includes("Grau/Sol")) {
			url.push(typesList['Grau/Sol'])
		}
		if (Object.keys(typesList).includes("Gênero")) {
			url.push(typesList['Gênero'])
		}
		if (Object.keys(typesList).includes("Formato")) {
			url.push(typesList['Formato'])
		}
		url = url.join('/').replace('///','').replace('//','')

	} else {
		if (props.value === "Todos") {
			url = '/'
		} else {
			url = props.url
		}
	}

	const enabledClass = props.enable ? "" : " header__button__disabled"


	if (enabledClass) {
		return <button className={"header__buttons" + enabledClass}>{props.value}</button>
	}
	if (props.size[0] <= 700) {
	return <Link to={url}><button className="header__buttons">{props.value}</button></Link>
	}

	return <Link to={url} reloadDocument><button className="header__buttons">{props.value}</button></Link>
}

export default HeaderOption
