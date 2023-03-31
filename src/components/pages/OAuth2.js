import { useEffect } from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import { Buffer } from "buffer";
import axios from "axios";

const OAuth2 = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    

    useEffect(() => {

        if(searchParams?.get('code')){
            const code = searchParams?.get('code');
            const client = 'client';
            const secret = 'secret';
            const headers = new Headers();
            headers.append('Content-type', 'application/json');
            headers.append('Authorization', `Basic ${Buffer.from(`${client}:${secret}`).toString('base64')}`);

            const verifier = sessionStorage.getItem('codeVerifier');

            const initialUrl = 'http://localhost:8081/oauth2/token?client_id=client&redirect_uri=http://localhost:8070/authorized&grant_type=authorization_code';
            const url = `${initialUrl}&code=${code}&code_verifier=${verifier}`;

            console.log(verifier);
            fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers
            }).then(async (response) => {
                const token = await response.json();
                
                if(token?.id_token && token?.access_token) {
                    sessionStorage.setItem('id_token', token.id_token);
                    sessionStorage.setItem('access_token', token.access_token);
                    // 리소스 서버에게 회원가입 여부 확인 후
                    axios
                        .get("/api/check")
                        .then((response) => {
                            const check = response.data;
                            if (check === true) {
                                navigate('/');
                            } else if (check === false) {
                                navigate('/welcome');
                            }
                        })
                        .catch((error) => {
                                if (error.response.status === 401) {
                                    navigate('/welcome');
                                }
                            }
                        );
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }, []);

    useEffect(() => {
        if(!searchParams?.get('code')){
            const codeChallenge = sessionStorage.getItem('codeChallenge');
            const link = `http://localhost:8081/oauth2/authorize?response_type=code&client_id=client&scope=openid&redirect_uri=http://localhost:8070/authorized&code_challenge=${codeChallenge}&code_challenge_method=S256`;

            window.location.href = link;
        }
    }, []);


    return <p>Redirecting ...</p>
}

export default OAuth2;