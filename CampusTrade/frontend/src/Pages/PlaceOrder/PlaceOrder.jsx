import React, { useContext } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/Storecontext'

const PlaceOrder = () => {

  const { getTotalCartAmount } = useContext(StoreContext);

  return (
    <form className='place-order'>
      <div className="placeorder-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-field">
          <input type="text" placeholder="First name"/>
          <input type="text" placeholder='Last name'/>
        </div>
        <input type="text" placeholder='Email Address'/>
        <input type="text" placeholder='Street'/>
        <div className="multi-field">
          <input type="text" placeholder="city"/>
          <input type="text" placeholder='State'/>
        </div>
        <div className="multi-field">
          <input type="text" placeholder="zip code"/>
          <input type="text" placeholder='country'/>
        </div>
        <input type='text' placeholder='phone no:'/>
      </div>
      <div className="placeorder-right">
      <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()===0 ? 0:2}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount()===0? 0: getTotalCartAmount()+2}</b>
            </div>
            <button className='checkout'>Procedd To Payment</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
