let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-item');
const totalTestimonials = testimonials.length;


function showTestimonials() {
    testimonials.forEach((item, i) => {
        // Show two testimonials side by side
        if (
            i === currentTestimonial ||
            i === (currentTestimonial + 1) % totalTestimonials
        ) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    showTestimonials();
}

function prevTestimonial() {
    currentTestimonial =
        (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    showTestimonials();
}

// Initialize testimonials display
showTestimonials();
