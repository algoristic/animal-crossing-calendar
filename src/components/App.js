import { Component } from 'react'

import Hemisphere from '../context/Hemisphere'
import Update from '../context/Update'

import AnimalService from '../service/AnimalService'
import DateTimeService from '../service/DateTimeService'
import PersistentStorage from '../service/PersistentStorage'

import FishPanel from './FishPanel'
import InsectsPanel from './InsectsPanel'
import MarineLifePanel from './MarineLifePanel'
import RemainingAnimalsPanel from './RemainingAnimalsPanel'
import SettingsBar from './SettingsBar'

import './App.css'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.storage = new PersistentStorage();
        let hemisphere = this.storage.getHemisphere();
        let sort = this.storage.getSort();
        this.state = {
            hemisphere: hemisphere,
            sort: sort,
            dateTimeService: new DateTimeService(),
            animalService: new AnimalService(hemisphere, sort)
        };
        this.refresh = this.refresh.bind(this);
        this.updateSort = this.updateSort.bind(this);
        this.setSortOrder = this.setSortOrder.bind(this);
        this.setHemisphere = this.setHemisphere.bind(this);
        this.setSortProperty = this.setSortProperty.bind(this);

        setTimeout(this.refresh, this.state.dateTimeService.getMillisRemaining());
    }

    updateSort(sort) {
        const { hemisphere } = this.state;
        const animalService = new AnimalService(hemisphere, sort);
        this.storage.setSort(sort);
        this.setState({
            sort: sort,
            animalService: animalService
        });
    }

    setSortProperty(property) {
        const { sort:{ order } } = this.state;
        const newSort = {
            property: property,
            order: order
        };
        this.updateSort(newSort);
    }

    setSortOrder(order) {
        const { sort:{ property } } = this.state;
        const newSort = {
            property: property,
            order: order
        };
        this.updateSort(newSort);
    }

    setHemisphere(hemisphere) {
        const oldHemisphere = this.state.hemisphere;
        this.setState({
            hemisphere: hemisphere,
            animalService: new AnimalService(hemisphere)
        });
        this.storage.setHemisphere(hemisphere);
        this.refresh();
        console.log(`Switch hemisphere, old=${oldHemisphere} new=${hemisphere}`);
    }

    refresh() {
        const dateTimeService = new DateTimeService();
        this.setState({
            dateTimeService: dateTimeService
        });
        setTimeout(this.refresh, dateTimeService.getMillisRemaining());
        console.log('Refreshed all domains');
    }

    render() {
        const { hemisphere, animalService, dateTimeService, sort } = this.state;
        return (
            <div className="app bootstrap-wrapper">
                <Hemisphere.Provider value={{ hemisphere: hemisphere, change: this.setHemisphere }}>
                    <Update.Provider value={{
                            update: this.refresh,
                            setSortProperty: this.setSortProperty,
                            setSortOrder: this.setSortOrder,
                            sort: sort
                        }}>
                        <SettingsBar />
                    </Update.Provider>
                    <InsectsPanel animals={animalService}
                        month={dateTimeService.month}
                        hour={dateTimeService.hour}>
                    </InsectsPanel>
                    <FishPanel animals={animalService}
                        month={dateTimeService.month}
                        hour={dateTimeService.hour}>
                    </FishPanel>
                    <MarineLifePanel animals={animalService}
                        month={dateTimeService.month}
                        hour={dateTimeService.hour}>
                    </MarineLifePanel>
                    <RemainingAnimalsPanel animals={animalService}
                        month={dateTimeService.month}
                        hour={dateTimeService.hour}>
                    </RemainingAnimalsPanel>
                </Hemisphere.Provider>
            </div>
        );
    }
}
