import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function ProductEditScreen() {
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const today = new Date();
  const curDate =
    today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

  const expDate =
    today.getDate() + '-' + (today.getMonth() + 7) + '-' + today.getFullYear();
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [serial, setSerial] = useState('');
  const [model, setModel] = useState('');
  const [time, setTime] = useState(0);
  const [sDay, setsDay] = useState(curDate);
  const [eDay, seteDay] = useState(expDate);
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setSlug(data.slug);
        setName(data.name);
        setAddress(data.address);
        setPhone(data.phone);
        setSerial(data.serial);
        setModel(data.model);
        setTime(data.time);
        setsDay(curDate);
        seteDay(expDate);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);
  const submitHandler = async (e) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/products/${productId}`, {
        _id: productId,
        slug,
        name,
        address,
        phone,
        serial,
        model,
        time,
        sDay,
        eDay,
      });
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Kích hoạt thành công');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const [active, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!active);
  };
  return (
    <>
      <Container className='small-container'>
        <div className='desktop-form'>
          <Helmet>
            <title>Bảo Hành Quốc Hưng</title>
          </Helmet>
          <Form
            onSubmit={submitHandler}
            id='form'
            className={`section-chat ${active ? 'hidden' : ''}`}
          >
            <h3>KÍCH HOẠT BẢO HÀNH TRỰC TUYẾN</h3>
            <Form.Group className='mb-3 hidden' controlId='slug'>
              <Form.Control
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='name'>
              <FloatingLabel
                controlId='floatingTextarea'
                label='Họ và Tên'
                className='mb-3'
              >
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3' controlId='address'>
              <FloatingLabel
                controlId='floatingTextarea'
                label='Địa Chỉ'
                className='mb-3'
              >
                <Form.Control
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3' controlId='phone'>
              <FloatingLabel
                controlId='floatingTextarea'
                label='Số điện thoại'
                className='mb-3'
              >
                <Form.Control
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3' controlId='serial'>
              <FloatingLabel
                controlId='floatingTextarea'
                label='Serial'
                className='mb-3'
              >
                <Form.Control
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3' controlId='model'>
              <FloatingLabel
                controlId='floatingTextarea'
                label='Model'
                className='mb-3'
              >
                <Form.Control
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3 hidden' controlId='time'>
              <Form.Label>Thời hạn bảo hành</Form.Label>
              <Form.Control
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3 hidden' controlId='sDay'>
              <Form.Label>Ngày kích hoạt</Form.Label>
              <Form.Control
                value={curDate}
                onChange={(e) => setsDay(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3 hidden' controlId='eDay'>
              <Form.Label>Ngày hết hạn</Form.Label>
              <Form.Control
                value={expDate}
                onChange={(e) => seteDay(e.target.value)}
              />
            </Form.Group>
            <div className='mb-3'>
              <Button
                disabled={
                  (loadingUpdate && !name) ||
                  !address ||
                  !phone ||
                  !serial ||
                  !model
                }
                type='submit'
                onClick={toggleClass}
              >
                Kích hoạt
              </Button>
              {loadingUpdate && <LoadingBox></LoadingBox>}
            </div>
          </Form>
          <div className='done'>
            <div className='content'>
              <h3>THÔNG TIN SẢN PHẨM</h3>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Tên Khách Hàng:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{name}</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Số điện thoại:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{phone}</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Serial:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{serial}</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Model:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{model}</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Thời hạn bảo hành:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{time} tháng</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Ngày kích hoạt:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{sDay}</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Ngày hết hạn:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{eDay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mobile-form'>
          <Helmet>
            <title>Bảo Hành Quốc Hưng</title>
          </Helmet>
          <Form onSubmit={submitHandler} id='form'>
            <h5>KÍCH HOẠT BẢO HÀNH TRỰC TUYẾN</h5>
            <Form.Group className='mb-3 hidden' controlId='slug'>
              <Form.Control
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='name'>
              <FloatingLabel
                controlId='floatingTextarea'
                label='Họ và Tên'
                className='mb-3'
              >
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3' controlId='address'>
              <FloatingLabel
                controlId='floatingTextarea'
                label='Địa Chỉ'
                className='mb-3'
              >
                <Form.Control
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3' controlId='phone'>
              <FloatingLabel
                controlId='floatingTextarea'
                label='Số điện thoại'
                className='mb-3'
              >
                <Form.Control
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3' controlId='serial'>
              <FloatingLabel
                controlId='floatingTextarea'
                label='Serial'
                className='mb-3'
              >
                <Form.Control
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3' controlId='model'>
              <FloatingLabel
                controlId='floatingTextarea'
                label='Model'
                className='mb-3'
              >
                <Form.Control
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3 hidden' controlId='time'>
              <Form.Label>Thời hạn bảo hành</Form.Label>
              <Form.Control
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3 hidden' controlId='sDay'>
              <Form.Label>Ngày kích hoạt</Form.Label>
              <Form.Control
                value={curDate}
                onChange={(e) => setsDay(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3 hidden' controlId='eDay'>
              <Form.Label>Ngày hết hạn</Form.Label>
              <Form.Control
                value={expDate}
                onChange={(e) => seteDay(e.target.value)}
              />
            </Form.Group>
            <div className='mb-3'>
              <Button
                disabled={
                  (loadingUpdate && !name) ||
                  !address ||
                  !phone ||
                  !serial ||
                  !model
                }
                type='submit'
              >
                Kích hoạt
              </Button>
              {loadingUpdate && <LoadingBox></LoadingBox>}
            </div>
          </Form>
          <div className='done'>
            <div className='content'>
              <h3>THÔNG TIN SẢN PHẨM</h3>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Tên Khách Hàng:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{name}</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Số điện thoại:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{phone}</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Serial:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{serial}</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Model:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{model}</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Thời hạn bảo hành:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{time} tháng</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Ngày kích hoạt:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{sDay}</p>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-6 col-md-3'>
                  <span className='txt1'>Ngày hết hạn:</span>
                </div>
                <div className='col-xs-6 col-md-3'>
                  <p>{eDay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
