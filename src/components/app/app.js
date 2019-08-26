import React, {Component} from 'react';

import AppHeader from "../app-header";
import SearchPanel from "../search-panel";
import TodoList from "../todo-list";
import ItemStatusFilter from "../item-status-filter";
import ItemAddForm from "../item-add-form";

import './app.css';

export default class App extends Component {

    maxId = 100;

    state = {
        todoData: [
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Watch TV Show'),
            this.createTodoItem('Set Alarm'),
        ],
        term: '',
        filter: 'all'
    };

    createTodoItem(label) {
        return {
            label: label,
            important: false,
            done: false,
            id: this.maxId++,
        }
    };

    deleteItem = (id) => {
        this.setState(({todoData}) => {
            const idx = todoData.findIndex((el) => el.id === id);

            const newArray = [
                ...todoData.slice(0, idx),
                ...todoData.slice(idx + 1)
            ];

            return {
                todoData: newArray
            }
        })
    };

    addItem = (text) => {
        const newItem = this.createTodoItem(text);

        this.setState(({todoData}) => {
            const newArray = [
                ...todoData,
                newItem,
            ];

            return {
                todoData: newArray
            }
        });

    };

    toggleProperty = (arr, id, propName) => {
        const idx = arr.findIndex((el) => el.id === id);

        const oldItem = arr[idx];
        const newItem = {
            ...oldItem,
            [propName]: !oldItem[propName]
        };

        return [
            ...arr.slice(0, idx),
            newItem,
            ...arr.slice(idx + 1)
        ];

    };

    toggleDone = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'done')
            };
        })
    };

    toggleImportant = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
            };
        })
    };

    search = (arr, term) => {
        if (term.length === 0) {
            return arr;
        }

        return  arr.filter((item) => {
            return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
        });
    };

    filter = (arr, filter) => {
        switch (filter) {
            case 'all':
                return arr;
            case 'active':
                return arr.filter((item) => !item.done);
            case 'done':
                return arr.filter((item) => item.done);
            default:
                return arr;
        }
    };

    onSearchChange = (term) => {
        this.setState({term});
    };

    onFilterChange = (filter) => {
        this.setState({filter});
    };

    render() {

        const { todoData, term, filter } = this.state;

        const visibleItems = this.filter(this.search(todoData, term), filter);
        const doneCount = todoData.filter((el) => el.done).length;
        const todoCount = todoData.length - doneCount;

        return (
            <div className={'todo-app'}>
                <AppHeader toDo={todoCount} done={doneCount} />

                <div className={'top-panel d-flex'}>
                    <SearchPanel onSearchChange={this.onSearchChange} />
                    <ItemStatusFilter filter={filter} onFilterChange={this.onFilterChange} />
                </div>

                <TodoList todos={visibleItems}
                          onDeleted={this.deleteItem}
                          onToggleImportant={this.toggleImportant}
                          onToggleDone={this.toggleDone}
                />

                <ItemAddForm onItemAdded={this.addItem} />
            </div>
        );
    }
};