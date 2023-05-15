import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Product from './ProductOverview/Product.jsx'
import Questions from './QuestionsAndAnswers/Questions.jsx'
import Related from './RelatedItems/Related.jsx'
import Reviews from './ReviewsAndRatings/Reviews.jsx'

import { getAvgRating } from './ReviewsAndRatings/helper.js';
import { emptyMeta } from './ReviewsAndRatings/exampleData.js'


const App = () => {
  const [currentItemID, setCurrentItemID] = useState(37315);
  const [currentItem, setCurrentItem] = useState();
  const [typedID, setTypedID] = useState();
  const [currentAvgRating, setCurrentAvgRating] = useState(0);
  const [currentReviewsMeta, setCurrentReviewsMeta] = useState(emptyMeta);

    /**
     * 373??
     * 11 => camo onesie
     * 12 => [out of stock] sunglasses
     * 13 - 14 => pants
     * 15-19 => shoes
     * 20 => infinity stones
     * 21 => CURSED BROKEN EMPTY PRODUCT DATA
     * 22+ => "unknown area"
     */
  useEffect(() => {
    axios.get(`/products/${currentItemID}`)
    .then((response) => {
      setCurrentItem(response.data)
    })
  }, [currentItemID])

  useEffect(() => {
    axios.get(`/reviews/meta/?product_id=${currentItemID}`)
    .then(response => {
      // console.log('Reviews metadata: ', response.data)
      let avgRating = getAvgRating(response.data);
      setCurrentAvgRating(avgRating);
      setCurrentReviewsMeta(response.data);
    })
    .catch(error =>
      console.log('Error getting metadata at home page 🫠', error))
  }, [currentItemID])


  return (
    <div id='main'>
      <h1>current item id  {currentItemID}🤯</h1>
      <nav style={{ display: 'flex' }}>
        <button type='button' onClick={() => { setCurrentItemID(currentItemID - 1) }}>previous</button>
        <button type='button' onClick={() => { setCurrentItemID(Number(currentItemID) + 1) }}>next</button>
        <input type='text' onChange={(e) => {
          setTypedID(e.target.value)
        }}></input>
        <button type='button' onClick={() => {
          setCurrentItemID(typedID)
        }}>enter specific id</button>
      </nav>
      <Product currentItem={currentItem} averageRating={currentAvgRating} />
      <Related currentItemID={currentItemID} />
      <Questions currentItemID={currentItemID} />
      <Reviews
        currentItemID={currentItemID}
        avgRating={currentAvgRating}
        reviewsMeta={currentReviewsMeta} />
    </div>
  )
}

export default App;
