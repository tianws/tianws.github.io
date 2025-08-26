import os
import re
import glob

def migrate_images_in_file(file_path):
    """Reads a file, replaces markdown images with the include tag, and saves it."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Correctly escaped regex for standard python string.
        # This finds ![alt](src) and captures alt and src.
        markdown_image_regex = r'!\[(.*?)\]\((.*?)\)'

        # The replacement format. Using r'' string to handle backslashes for subn.
        replacement_string = r'{% include image.html src="\2" alt="\1" %}'

        # Perform the replacement
        new_content, num_replacements = re.subn(markdown_image_regex, replacement_string, content)

        if num_replacements > 0:
            print(f"Processing {file_path}... found and replaced {num_replacements} image(s).")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
        else:
            print(f"Scanning {file_path}... no standard markdown images found.")

    except Exception as e:
        print(f"Error processing file {file_path}: {e}")

def main():
    """Main function to find all markdown files and process them."""
    posts_directory = './_posts'
    markdown_files = glob.glob(os.path.join(posts_directory, '*.markdown'))
    
    if not markdown_files:
        print(f"No markdown files found in {posts_directory}")
        return

    print(f"Found {len(markdown_files)} markdown files. Starting migration...")
    
    for md_file in markdown_files:
        migrate_images_in_file(md_file)
    
    print("\nMigration complete.")

if __name__ == '__main__':
    main()
