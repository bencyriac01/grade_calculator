# 📊 Student Grade Calculator System

A modern, professional web application for calculating SGPA, CGPA, and tracking academic performance with an intuitive interface and powerful analytics.

## ✨ Features

### 🎓 Core Functionality
- **SGPA Calculator**: Calculate semester GPA with unlimited subjects
- **CGPA Calculator**: Compute cumulative GPA from multiple semesters
- **Semester Tracker**: Track and compare semester-wise performance
- **CGPA Predictor**: Predict future CGPA based on expected performance
- **Goal Tracking**: Set academic goals and track progress toward them

### 📈 Analytics & Visualization
- **CGPA Growth Chart**: Visualize cumulative GPA trend over semesters
- **Semester Performance Chart**: Compare SGPA across semesters
- **Credits Distribution Chart**: Pie chart showing credit distribution
- **Grade Distribution Chart**: Radar chart of grade frequencies

### 💾 Data Management
- **Local Storage**: Automatically save all data in browser
- **Export PDF**: Generate professional grade reports as PDF
- **Export JSON**: Download complete data as JSON file
- **Import JSON**: Import previously exported data
- **Reset Option**: Clear all data and start fresh

### 🎨 Design & UX
- **Glassmorphism UI**: Modern frosted glass aesthetic
- **Dark & Light Mode**: Toggle between themes
- **Fully Responsive**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Elegant transitions and micro-interactions
- **Professional Dashboard**: Clean, organized layout

### 📱 Responsive Design
- Desktop dashboard layout
- Tablet optimization
- Mobile-first responsive
- Touch-friendly controls

## 🚀 Getting Started

### Installation
1. Extract all files to a folder
2. Ensure you have:
   - `index.html` - Main HTML file
   - `styles.css` - Stylesheet with animations and themes
   - `script.js` - JavaScript functionality

### Running the Application
- **Option 1**: Open `index.html` directly in your web browser
- **Option 2**: Use a local server (recommended for best experience)
  ```bash
  # Using Python 3
  python -m http.server 8000
  
  # Using Python 2
  python -m SimpleHTTPServer 8000
  
  # Using Node.js (with http-server)
  npx http-server
  ```
- Visit `http://localhost:8000` in your browser

## 📚 How to Use

### 1. Student Profile
- Enter your name and roll number
- This information appears in all reports

### 2. SGPA Calculator
- Click "SGPA Calculator" in the sidebar
- Click "+ New Semester" to create a new semester
- Add subjects with:
  - Subject Name
  - Credit (1-6)
  - Grade (A+ to F)
- SGPA automatically calculates
- Click "Save Semester" to store semester data

### 3. CGPA Calculator
- Click "CGPA Calculator" in the sidebar
- View cumulative GPA calculated from all saved semesters
- See percentage conversion (4.0 scale)
- Use CGPA Predictor to estimate future CGPA
  - Enter expected SGPA
  - Enter credits for next semester
  - View predicted future CGPA

### 4. Semester Tracker
- View all semesters in timeline format
- See semester cards with detailed stats
- Compare semesters with performance metrics
- Delete semesters if needed

### 5. Analytics Dashboard
- View four interactive charts:
  - CGPA growth trend over time
  - Semester-wise SGPA comparison
  - Credit distribution across semesters
  - Grade distribution across all subjects
- Charts update automatically with new data

### 6. Goal Tracking
- Set your target CGPA on the dashboard
- Visual progress bar shows current progress
- Displays remaining points needed
- Shows achievement status

### 7. Export & Import
- **PDF Export**: Click "Export as PDF" to download report
- **JSON Export**: Click "Download Data" to save data file
- **JSON Import**: Click "Import Data" to restore from file

## 🎨 Customization

### Grade Scale
The calculator uses the standard 4.0 GPA scale:
- A+ (10): 4.0 points
- A (9): 3.7 points
- B+ (8): 3.3 points
- B (7): 3.0 points
- C+ (6): 2.7 points
- C (5): 2.3 points
- D (4): 2.0 points
- F (0): 0.0 points

You can modify these values in `script.js` in the `GRADE_POINTS` object.

### Colors & Theme
The application uses CSS variables for easy customization:
- Edit `:root` variables in `styles.css`
- Change `--primary-color`, `--secondary-color`, etc.
- Add new color schemes by creating new CSS classes

## 💡 Tips & Best Practices

1. **Regular Updates**: Add subjects as you complete them
2. **Backup Data**: Periodically export your data as JSON
3. **Dark Mode**: Use dark mode for extended study sessions
4. **Mobile Usage**: Access on phone for on-the-go tracking
5. **Clear Goals**: Set realistic CGPA targets for motivation

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Advanced styling, animations, grid/flex
- **Vanilla JavaScript**: No dependencies (except Chart.js)
- **Chart.js**: Interactive data visualization
- **html2pdf**: PDF generation
- **Local Storage**: Client-side data persistence

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Optimized for fast loading
- Smooth animations (60fps)
- Efficient calculations
- Minimal memory footprint

## 📊 Data Structure

### Semester Object
```javascript
{
  id: "semester_1234567890",
  name: "Semester 1",
  sgpa: 8.45,
  credits: 18,
  subjects: [...],
  date: "6/25/2026"
}
```

### Subject Object
```javascript
{
  id: 1234567890,
  name: "Data Structures",
  credit: 4,
  grade: 9,
  gradePoint: 3.7
}
```

## 🐛 Troubleshooting

### Data Not Saving
- Check if browser allows local storage
- Clear browser cache and try again
- Try in private/incognito mode

### Charts Not Displaying
- Ensure Chart.js library is loaded
- Refresh the page
- Check browser console for errors

### Export Not Working
- Check browser pop-up blocker settings
- Try in a different browser
- Ensure sufficient disk space

## 📝 Notes

- All data is stored locally in your browser
- Data is not sent to any server
- Clearing browser data will delete all saved grades
- Regular backups are recommended

## 🎯 Future Enhancements

Possible improvements:
- Grading curve visualization
- Class rank calculation
- Study time tracker
- Scholarship eligibility checker
- Mobile app version
- Cloud sync option
- Collaborative features

## 📄 License

This project is open source and available for personal and educational use.

## 🤝 Support

For issues or suggestions:
1. Check the troubleshooting section
2. Clear browser cache
3. Try a different browser
4. Reset data and start fresh

## 🎓 Academic Use

This calculator is designed to help students:
- Track academic performance
- Plan for semester goals
- Monitor GPA trends
- Make informed academic decisions
- Motivate academic excellence

---

**Version**: 1.0  
**Last Updated**: June 2026  
**Status**: Production Ready ✅

Enjoy tracking your academic journey! 📚✨
