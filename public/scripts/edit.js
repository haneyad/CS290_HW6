<form id="editForm" method="post">
    <table id="inputTable">
        <thead>
            <tr>
                <th>Name</th>
                <th>Reps</th>
                <th>Weight</th>
                <th>Date</th>
                <th>Unit</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <input type="text" name="name" required />
                </td>
                <td>
                    <input type="text" name="reps" required />
                </td>
                <td>
                    <input type="text" name="weight" required/>
                </td>
                <td>
                    <input type="date" name="date" required/>
                </td>
                <td>
                    <input type="text" name="lbs" required/>
                </td>
                <td>
                    <button type="button" id="editSubmit">Add</button>
                </td>
            </tr>
        </tbody>
    </table>
</form>