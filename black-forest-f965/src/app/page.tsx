import Image from "next/image";

export default function Home() {
  return (
  <div>
    <h1 className="text-yellow font-mono">Enter your tasks below:</h1>
    <h2>Task Input</h2>
    <form>
        <label htmlFor="task">Please enter you first task name: </label>
        <input type="text" id="task" name="task"/>
        <input type="submit" value="Submit"/>
        <form action="/action_page.php" method="get"></form>
    </form>

</div>
  );
}
