#!/bin/bash

# Directory where HTML pages will be created
output_dir="../pages"

# Create the output directory if it doesn't exist
mkdir -p "$output_dir"

# Loop from 1 to 18 to create HTML files
for i in {1..18}; do
    # Create file name
    filename="$output_dir/day$i.html"
    
    # Create basic HTML structure
    cat > "$filename" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Day $i</title>
        <link rel="stylesheet" href="../css/style.css">
</head>
<body>
        <header>
                <h1>Day $i</h1>
        </header>
        <main>
                <p>Content for day $i goes here.</p>
        </main>
        <footer>
                <p>&copy; $(date +%Y)</p>
        </footer>
</body>
</html>
EOF

    echo "Created $filename"
done

echo "All HTML files have been created."