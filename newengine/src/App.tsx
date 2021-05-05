import React from 'react';
import { Home } from './Components/Home/Home';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Lobby } from './Components/Lobby/Lobby';

export const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/lobby/:lobbyId" component={Lobby} />
            </Switch>
        </BrowserRouter>
    );
};
