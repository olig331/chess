import React from 'react';
import { GameInstance } from './Components/GameInstance/GameInstance';
import { Home } from './Components/Home/Home';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

export const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/lobby/:lobbyId" component={GameInstance} />
            </Switch>
        </BrowserRouter>
    );
};
