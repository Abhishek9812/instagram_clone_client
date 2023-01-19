import { Button, Layout, Spin } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import MultiImageInput from 'react-multiple-image-input';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import backendUrl from './BackendUrl';
import Cookies from 'universal-cookie';
const { Content } = Layout;
const cookie = new Cookies();

const CreatePost = () => {
    const crop = {
        unit: '%',
        aspect: 4 / 3,
        width: '100'
    };

    const [images, setImages] = useState({});
    const [loader, setLoader] = useState(false);
    const history = useHistory();

    const handlePostSubmit = async () => {
        try {
            console.log("Images are:->", images);
            let userId = localStorage.getItem("userId");
            let username = localStorage.getItem("username");

            if (!userId || !username) {
                toast.error("User not found. Please login again!", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                return;
            }
            let data = {
                images: images,
                author: {
                    userId,
                    username
                }
            }
            setLoader(true);
            await axios.post(`${backendUrl}/createPost`, data, {
                headers: {
                    authorization: cookie.get('token', { path: '/' }),
                }
            }).then((res) => {
                if (res.data.code === 206) {
                    setLoader(false);
                    toast.error(res.data.msg, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    return;
                } else {
                    setLoader(false);
                    toast.success(res.data.msg, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    history.push('/');
                }
            }).catch((err) => {
                setLoader(false);
                console.log(err);
            })

        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    }


    return (
        <Layout>
            <Content className='content'>
                <div className='container'>
                    {loader ?
                        <div className="example">
                            <Spin />
                        </div> : <>
                            <MultiImageInput
                                theme="light"
                                images={images}
                                setImages={setImages}
                                cropConfig={{ crop, ruleOfThirds: true }}
                            />
                            <Button type="primary" onClick={handlePostSubmit} >Submit</Button>
                        </>
                    }
                </div>
            </Content>
        </Layout>

    );
}

export default CreatePost;