import React from 'react'
import { NavLink } from 'react-router-dom'
import {connect} from 'react-redux'
import {Col, Row} from 'react-bootstrap'
import Categories from './Categories.jsx'

const mapStateToProps = function(state) {
	return {
		products: state.products
	}
}

function ProductList(props){
	if(props.products){
		return (
			<Row>
				<Categories />
				<Col xs={12} sm={9}>
					<ul className="list-unstyled">
						{ props.products.map(product => {
							let categoryArray, categoryNameArray
							if (product.categories){
								categoryArray = product.categories
								categoryNameArray = categoryArray.map(category => {
									return category.name
								})
							}
							return (
								<li className="productItem" key={product.id}>
									<NavLink to={`/products/${product.id}`}>
										<div className="productImage">
											<img src={`${product.imageURL}`} alt={`${product.name} image`} height="60" width="60" />
										</div>
										<div className="productInfo">
											<div><h4>Product: {product.name}</h4></div>
											<div><h4>${product.price}</h4></div>
											<div><h5>Category: {product.categories.length ? categoryNameArray.join(', ') : 'None'}</h5></div>
											<div><h5>Amount Remaining: {product.quantity}</h5></div>
										</div>
									</NavLink>
								</li>
							)
						})
						}
					</ul>
				</Col>
			</Row>
		)
	} else {
		return(<div>Error</div>)
	}
}

const ProductContainer = connect(mapStateToProps)(ProductList)

export default ProductContainer