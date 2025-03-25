import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import urls from '../../data/urls.json'
import types from '../../data/types.json'
import colors from '../../data/colors.json'
import './Produto.css'
import WppButtonProduct from './WppButtonProduct'

const ImgCarousel = (props) => {
	if (props.imgs) {
		if (props.imgs.length > 1) {
			return (
					<div className="card__img__colection--product">
						{props.imgs.map(e => <img style={{translate: `${-100 * props.currImg}%`}} alt={props.modelo} className="card__image__custom--product" src={e} loading="lazy" key={e}/>)}
					</div>
			)
		} else {
			return (

					<div className="card__img__colection--product">
				<img alt={props.modelo} className="card__image__custom--product" src={props.imgs[0]} loading="lazy"/>
				</div>
			)

		}
	}
}
const ImgContainer = (props) => {
	if (props.tipoDeCard === "Com Preço Promocional") {
		return (
		<div className="promoContainer">
			<div className="discount--product"><p>{props.discount} %</p></div>
		<ImgCarousel
				tipoDeCard={props.tipoDeCard} 
				imgs={props?.imgs} 
				currImg={props.currImg} 
				discount={props.discount}
				marca={props.marca}
				modelo={props.modelo}
				wppDesc={props.wppDesc}
		/>
		</div>
		)
	}
	return (
		<ImgCarousel
				tipoDeCard={props.tipoDeCard} 
				imgs={props?.imgs} 
				currImg={props.currImg} 
				discount={props.discount}
				marca={props.marca}
				modelo={props.modelo}
				wppDesc={props.wppDesc}
		/>
	)
}


const Produto = () => {
	const params = useParams()
	const product = params.product
	const [currItem, setCurrItem] = useState([])
	const [varId, setCurrVarId] = useState(0)
	const [currImg, setCurrImg] = useState(0)
	const product__params = product.split("--")
	const brand = product__params[0]

	useEffect(() => {
		fetch('/data/items/' + urls[brand] + '.json', {method: 'GET'})
			.then(res => res.json())
			.then(items => {
				for (const item of items) {
					let should_break = false
					if ("variações" in item) {
						for (let i = 0; i < item['variações'].length; i++) {
							const variation = item['variações'][i]
							const marca = "marca" in variation ? variation['marca'] : ""
							const modelo = "modelo" in variation ? variation['modelo'] : ""
							const corN = "cor numérica" in variation ? variation['cor numérica'] : ""
							const cor = "cor" in variation ? variation['cor'] : ""
							const wppDesc = "wppDesc" in variation ? variation['wppDesc'] : ""
							const looking = [marca, modelo, corN, wppDesc, cor].filter(e => e !== "")

							if (looking.join("") == product__params.join("")) {
								setCurrItem([item, ...item['variações']])
								setCurrVarId(i + 1)
								should_break = true
								break
							}
						}
					}
					if (should_break) break
					const marca = "marca" in item ? item['marca'] : ""
					const modelo = "modelo" in item ? item['modelo'] : ""
					const corN = "cor numérica" in item ? item['cor numérica'] : ""
					const wppDesc = "wppDesc" in item ? item['wppDesc'] : ""
					const cor = "cor" in item ? item['cor'] : ""
					const looking = [marca, modelo, corN, wppDesc, cor].filter(e => e !== "")
					if (looking.join("") == product__params.join("")) {
						if ("variações" in item) setCurrItem([item, ...item['variações']])
						else setCurrItem([item])
						break
					}
				}
			})}, [])
	useEffect(() => {
		if (!currItem.length) return
		if (!currItem[varId]['imgs']) {
			return
		}
		if (currItem[varId]['imgs'].length === 1) return
		const timedOut = setTimeout(() => {setCurrImg(currImg === currItem[varId]['imgs'].length - 1 ? 0 : currImg + 1)}, 4000)
		return () => clearTimeout(timedOut)
	},[currImg])

	if (!currItem.length) return
	const currVar = currItem[varId]


	const marca_curr = "marca" in currItem[varId] ? currItem[varId].marca : ""
	const modelo_curr = "modelo" in currItem[varId] ? currItem[varId].modelo : ""
	const corN_curr = "cor numérica" in currItem[varId] ? currItem[varId]['cor numérica'] : ""
	const wppDesc_curr = "wppDesc" in currItem[varId]? currItem[varId].wppDesc : ""
	const cor_curr = "cor" in currItem[varId] ? currItem[varId].cor : ""



	const paramsWpp = [marca_curr, modelo_curr, corN_curr, wppDesc_curr, cor_curr].filter(e => e !== "").join("--")
	let wppMsg = encodeURI("Olá! Gostei muito desse!\n " + window.location.hostname + "/produto/" + paramsWpp)


	let formater = new Intl.NumberFormat('pt-BR', {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
	let times = 1
	while (currVar['preco']/times > 60 && times < 12) { // 60 é o valor minimo da parcela
		times++
	}
	let precoFormatado = formater.format(currVar['preco']/times)
	let price_option1 = times === 1 ? <p><strong>{precoFormatado} à vista</strong></p> : <p><strong>{times}x de {precoFormatado} sem juros</strong></p>
		let price_option2 =  times === 1 ? "" : <p>ou {formater.format(currVar['preco'])} à vista</p>

		if (!currVar['imgs']) {
			return <></>
		}

const changeProductVar = (index) => {
	setCurrVarId(index)
}
	return (
		<div className="product">
		<ImgContainer tipoDeCard={currVar['tipoDeCard']} imgs={currVar['imgs']} currImg={currImg} discount={(100 - (currVar['precoPromo']/currVar['preco']) * 100)*-1}/>
		<div className="product__specs">
		<div className="product__specs--specs">
		<h1>{currVar['marca']}</h1>
		<p className="product__specs--model">{currVar['modelo']} {currVar['cor numérica']}</p>
		<div className="product__variations">{currItem.length > 1 && currItem.map((e,i) => {
		return <button key={e.cor + e.marca + e.modelo + e.corN} className={"product__variations__btn " + (i === varId ? "active" : "")} style={{backgroundImage: "url('"+ colors[e.cor] + "')"}} onClick={() => changeProductVar(i)}></button>
		})}</div>
		</div>
		<div className="product__specs--price">
		{price_option1}
		{price_option2}
		</div>
		<WppButtonProduct
		mensagem={wppMsg}
		texto={"Eu quero!"}
		/>
		</div>
		</div>
	)
}

export default Produto
