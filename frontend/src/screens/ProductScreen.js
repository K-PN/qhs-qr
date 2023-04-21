import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [serial, setSerial] = useState('');
  const [model, setModel] = useState('');
  const [time, setTime] = useState('');
  const [sDay, setsDay] = useState('');
  const [eDay, seteDay] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  //Nút kích hoạt
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  //Nút kích hoạt

  //Lấy ngày hiện tại
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;
  //Lấy ngày hiện tại

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div>
      <div className='done'>
        <div className='content'>
          <h3>THÔNG TIN SẢN PHẨM</h3>
          <div className='row'>
            <div class='col-xs-6 col-md-3'>
              <span class='txt1'>Tên Khách Hàng:</span>
            </div>
            <div class='col-xs-6 col-md-9'>
              <p>{product.name}</p>
            </div>
          </div>
          <div className='row'>
            <div class='col-xs-6 col-md-3'>
              <span class='txt1'>Số điện thoại:</span>
            </div>
            <div class='col-xs-6 col-md-9'>
              <p>{product.phone}</p>
            </div>
          </div>
          <div className='row'>
            <div class='col-xs-6 col-md-3'>
              <span class='txt1'>Serial:</span>
            </div>
            <div class='col-xs-6 col-md-9'>
              <p>{product.serial}</p>
            </div>
          </div>
          <div className='row'>
            <div class='col-xs-6 col-md-3'>
              <span class='txt1'>Model:</span>
            </div>
            <div class='col-xs-6 col-md-9'>
              <p>{product.model}</p>
            </div>
          </div>
          <div className='row'>
            <div class='col-xs-6 col-md-3'>
              <span class='txt1'>Thời hạn bảo hành:</span>
            </div>
            <div class='col-xs-6 col-md-9'>
              <p>{product.time}</p>
            </div>
          </div>
          <div className='row'>
            <div class='col-xs-6 col-md-3'>
              <span class='txt1'>Ngày kích hoạt:</span>
            </div>
            <div class='col-xs-6 col-md-9'>
              <p>{product.sDay}</p>
            </div>
          </div>
          <div className='row'>
            <div class='col-xs-6 col-md-3'>
              <span class='txt1'>Ngày hết hạn:</span>
            </div>
            <div class='col-xs-6 col-md-9'>
              <p>{product.eDay}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductScreen;
