import Image from "next/image";

export default function Home() {
  return (
    <!doctype html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
</head>
<body>
    <h1 class="text-yellow font-mono">Enter your tasks below:</h1>
    <h2>Task Input</h2>
    <form>
        <label for="task">Please enter you first task name: </label><br>
        <input type="text" id="task" name="task"><br>
        <input type="submit" value="Submit">
        <form action="/action_page.php" method="get"></form>
    </form>
</body>
</html>
  );
}
