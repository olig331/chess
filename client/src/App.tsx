import React from 'react';
import { GameInstance } from './Components/GameInstance/GameInstance';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './Components/Home/Home';

export const App: React.FC = () => {
    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/lobby/:lobbyId" exact component={GameInstance} />
                </Switch>
            </BrowserRouter>
        </>
    );
};