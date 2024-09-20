import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Activity } from "../types";
import { categories } from "../data/categories";
import { ActivityActions, ActivityState } from "../reducers/activity-reducer";

type FormProps = {
    dispatch: Dispatch<ActivityActions>;
    state: ActivityState;
};

const initialState: Activity = {
    id: uuidv4(),
    category: 1,
    name: "",
    calories: 0,
};

export default function Form({ dispatch, state }: FormProps) {
    const [activity, setActivity] = useState<Activity>(initialState);

    useEffect(() => {
        if (state.activeId) {
            const selectedActivity = state.activities.filter(
                (stateActivity) => stateActivity.id === state.activeId
            )[0];

            setActivity(selectedActivity);
        }
    }, [state.activeId]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setActivity({
            ...activity,
            [e.target.id]:
                e.target.id === "calories"
                    ? +e.target.value
                    : e.target.id === "category"
                    ? +e.target.value
                    : e.target.value,
        });
    };

    const isValidActivity = () => {
        const { name, calories } = activity;
        const isNameValid = name.trim().length > 0;
        const isCaloriesValid = calories > 0;

        return isNameValid && isCaloriesValid;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        dispatch({
            type: "save-activity",
            payload: { newActivity: activity },
        });

        setActivity({
            ...initialState,
            id: uuidv4(),
        });
    };

    return (
        <form
            className="space-y-5 bg-white shadow p-10 rounded-lg"
            onSubmit={handleSubmit}
        >
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="category" className="font-bold">
                    Categoría:
                </label>
                <select
                    className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                    id="category"
                    value={activity.category}
                    onChange={handleChange}
                >
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="name" className="font-bold">
                    Actividad:
                </label>
                <input
                    type="text"
                    id="name"
                    className="border border-slate-300 p-2 rounded-lg w-full"
                    placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
                    value={activity.name}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="calories" className="font-bold">
                    Calorías:
                </label>
                <input
                    type="number"
                    id="calories"
                    className="border border-slate-300 p-2 rounded-lg w-full"
                    placeholder="Ej. 300 o 500"
                    value={activity.calories}
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                value={
                    activity.category === 1
                        ? "Guardar Comida"
                        : "Guardar Ejercicio"
                }
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold p-2 uppercase cursor-pointer w-full disabled:opacity-50"
                disabled={!isValidActivity()}
            />
        </form>
    );
}
