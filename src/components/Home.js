import React, { useEffect, useState } from 'react';
import { Avatar, Divider, Layout, Card, Carousel, Image, Spin, Modal } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'universal-cookie';
import backendUrl from './BackendUrl';
import { useHistory } from 'react-router-dom';

const { Content } = Layout;
const { Meta } = Card;

const Home = (props) => {
    const cookie = new Cookies();
    const history = useHistory();
    const [userData, setUserData] = useState();
    const [data, setData] = useState();
    const [indc, setIndc] = useState();
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState();
    const [loader, setLoader] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let username = localStorage.getItem('username');
        let userId = localStorage.getItem('userId');
        let token = cookie.get('token', { path: '/' })
        if (!userId || !token) {
            localStorage.clear();
            cookie.remove('token');
            history.push('/login');
            return;
        }
        setUsername(username);
        console.log(userId);
        setUserId(userId);
        if (props.userData)
            setUserData(props.userData);
        getAllPosts(true);
    }, [props]);

    const showModal = (index) => {
        setIndc(index);
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const getAllPosts = async (isLoading) => {
        try {
            if (isLoading)
                setLoader(true);
            await axios.get(`${backendUrl}/getAllPosts`, {
                headers: {
                    authorization: cookie.get('token', { path: '/' }),
                }
            }).then((res) => {
                setLoader(false);
                if (res && res.data.code == 200) {
                    console.log(res.data);
                    setData(res.data.data);
                }
            }).catch((err) => {
                setLoader(false);
                console.log(err);
                localStorage.clear();
                cookie.remove('token');
                history.push('/login');
            })
        } catch (error) {
            setLoader(false);
            console.log(error);
            localStorage.clear();
            cookie.remove('token');
            history.push('/login');
        }
    }

    const onChange = (currentSlide) => {
    };

    const handleLikePost = async (post) => {
        try {
            console.log(post);
            if (!username || !userId) {
                localStorage.clear();
                history.push('/login');
                return;
            }


            let data = {
                userData: {
                    username,
                    userId,
                },
                id: post._id
            }

            await axios.post(`${backendUrl}/likePost`, data, {
                headers: {
                    authorization: cookie.get('token', { path: '/' }),
                }
            }).then((res) => {
                getAllPosts(false);
            }).catch((err) => {
                console.log(err);
            })

        } catch (error) {
            console.log(error);
        }
    }

    const handleDisLikePost = async (post) => {
        try {
            console.log(post);
            if (!username || !userId) {
                localStorage.clear();
                history.push('/login');
                return;
            }


            let data = {
                userData: {
                    username,
                    userId,
                },
                id: post._id
            }

            await axios.post(`${backendUrl}/dislikePost`, data, {
                headers: {
                    authorization: cookie.get('token', { path: '/' }),
                }
            }).then((res) => {
                getAllPosts(false);
            }).catch((err) => {
                console.log(err);
            })

        } catch (error) {
            console.log(error);
        }
    }

    return <>
        <Layout>
            <Content className='content'>
                {loader ?
                    <div className="example">
                        <Spin />
                    </div> :
                    <>
                        <div className='container'>

                            <Divider />
                            {
                                data && data.length && data.map((post, index) => {
                                    return (<>

                                        <div className="site-card-border-less-wrapper cardClass">
                                            <Card
                                                bordered={false}
                                                style={{
                                                    width: "50%",
                                                    height: "30%",
                                                }}
                                                actions={[
                                                    post.likedUsers.length && post.likedUsers.find(element => element.userId == userId)
                                                        ?
                                                        <HeartFilled tyle={{ fontSize: '30px', color: '#08c' }}
                                                            theme="outlined"
                                                            key="like"
                                                            onClick={() => handleDisLikePost(post)} />

                                                        :
                                                        <HeartOutlined tyle={{ fontSize: '30px', color: '#08c' }}
                                                            theme="filled"
                                                            key="like"
                                                            onClick={() => handleLikePost(post)} />,

                                                    <p onClick={() => showModal(index)} >{post.likeCount}</p>
                                                ]}
                                            >
                                                <Meta
                                                    avatar={<Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                                        {post.author.username[0].toUpperCase()}
                                                    </Avatar>}
                                                    title={post.author.username}
                                                />
                                                <Divider />

                                                <Carousel className="cardClass"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                    }}
                                                    afterChange={onChange}
                                                >
                                                    {
                                                        post.images.length && post.images.map((image, ind) => {
                                                            return (<>
                                                                <Image
                                                                    width={"300px"}
                                                                    height={"400px"}
                                                                    src={image}
                                                                />
                                                            </>)
                                                        })
                                                    }
                                                </Carousel>
                                                <Modal title="Liked By" open={isModalOpen && index === indc} onOk={handleOk} onCancel={handleCancel}>
                                                    {
                                                        post.likedUsers && post.likedUsers.length && post.likedUsers.map((likedUser, inds) => {
                                                            return (<>
                                                                <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                                                    {likedUser ? likedUser.username[0].toUpperCase() : ''}
                                                                </Avatar>
                                                                <span> {` ${likedUser.username}`}</span>
                                                            </>)
                                                        })
                                                    }
                                                </Modal>
                                            </Card>
                                        </div>
                                    </>)
                                })
                            }
                        </div>
                    </>
                }
            </Content>
        </Layout>
    </>
}

export default Home;