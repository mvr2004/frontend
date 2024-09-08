import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography } from '@mui/material';

const Dashboard = () => {
    const [forumActive, setForumActive] = useState(0);
    const [forumInactive, setForumInactive] = useState(0);
    const [estabActive, setEstabActive] = useState(0);
    const [estabInactive, setEstabInactive] = useState(0);
    const [unpublishedCount, setUnpublishedCount] = useState(0);
    const [publishedCount, setPublishedCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const centroId = localStorage.getItem('idCentro'); // Recupera o centroId do localStorage

                const [
                    { data: { ativos: forumActive, inativos: forumInactive } },
                    { data: { active: estabActive, inactive: estabInactive } },
                    { data: { unpublishedCount, publishedCount, activeCount } }
                ] = await Promise.all([
                    axios.get(`https://backend-9hij.onrender.com/forum/count-status/${centroId}`),
                    axios.get(`https://backend-9hij.onrender.com/estab/contar/ativos-inativos/${centroId}`),
                    axios.get(`https://backend-9hij.onrender.com/envt/eventCounts/${centroId}`)
                ]);

                setForumActive(forumActive);
                setForumInactive(forumInactive);
                setEstabActive(estabActive);
                setEstabInactive(estabInactive);
                setUnpublishedCount(unpublishedCount);
                setPublishedCount(publishedCount);
                setActiveCount(activeCount);
            } catch (error) {
                console.error('Erro ao buscar dados do backend:', error);
                setError('Erro ao buscar dados do backend');
            }
        };

        fetchData();
    }, []);

    return (
        <Grid container spacing={3} justifyContent="center">
            {error && (
                <Grid item xs={12}>
                    <Box
                        textAlign="center"
                        border={1}
                        p={2}
                        borderRadius={5}
                        boxShadow={3}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                    >
                        <Typography variant="h6" color="error">
                            {error}
                        </Typography>
                    </Box>
                </Grid>
            )}
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Fórum Ativos</Typography>
                    <Typography variant="h4">{forumActive}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Fórum Inativos</Typography>
                    <Typography variant="h4">{forumInactive}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Estabelecimentos Ativos</Typography>
                    <Typography variant="h4">{estabActive}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Estabelecimentos Inativos</Typography>
                    <Typography variant="h4">{estabInactive}</Typography>
                </Box>
            </Grid>

            {/* Novos Dados de Contagem de Eventos */}
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Eventos Não Publicados</Typography>
                    <Typography variant="h4">{unpublishedCount}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Eventos Publicados</Typography>
                    <Typography variant="h4">{publishedCount}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Eventos Ativos</Typography>
                    <Typography variant="h4">{activeCount}</Typography>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
