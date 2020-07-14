import axios from 'axios';

const BASE_URL = "http://localhost/supportbot";

const api = axios.create({
    baseURL: BASE_URL,

});

export const getStats = () => {
    return api.get(`/stats`);
}

export const incrementContacted = () => {
    return api.post(`/stats/botContacted`);
}

export const incrementChatStarted = () => {
    return api.post(`/stats/botChatStarted`);
}

export const incrementChatInterrupted = () => {
    return api.post(`/stats/botChatInterrupted`);
}

export const incrementCreateSupportTicket = () => {
    return api.post(`/stats/botSupportTickets`);
}

export const getArticles = (description) => {
    return api.post(`/articles`, {
        description
    });
}

export const incrementArticleHelped = (id) => {
    return api.post(`/articles/helped?id=${id}`);
}

export const incrementArticleDidNotHelp = (id) => {
    return api.post(`/articles/notHelped?id=${id}`);
}